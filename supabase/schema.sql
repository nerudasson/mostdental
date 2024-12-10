-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create custom types
create type user_role as enum ('dentist', 'lab');
create type estimate_status as enum ('draft', 'pending_lab', 'priced', 'accepted', 'rejected');
create type order_status as enum ('pending', 'pending_checkin', 'rejected', 'in_progress', 'completed', 'cancelled');

-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text not null,
  role user_role not null,
  practice_name text,
  lab_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint valid_names check (
    (role = 'dentist' and practice_name is not null and lab_name is null) or
    (role = 'lab' and lab_name is not null and practice_name is null)
  )
);

-- Create RLS policies for profiles
alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Create cost_estimates table
create table cost_estimates (
  id uuid default uuid_generate_v4() primary key,
  dentist_id uuid references profiles(id) not null,
  lab_id uuid references profiles(id),
  patient_id text not null,
  treatment_type text not null,
  description text not null,
  total_cost decimal(10,2) not null,
  lab_fees decimal(10,2),
  status estimate_status not null default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  befunde jsonb,
  regelversorgung jsonb,
  therapie jsonb,
  notes text,
  constraint valid_lab_fees check (
    (lab_id is null and lab_fees is null) or
    (lab_id is not null)
  )
);

-- Create RLS policies for cost_estimates
alter table cost_estimates enable row level security;

create policy "Dentists can view their own estimates"
  on cost_estimates for select
  using (auth.uid() = dentist_id);

create policy "Labs can view estimates assigned to them"
  on cost_estimates for select
  using (auth.uid() = lab_id);

create policy "Dentists can create estimates"
  on cost_estimates for insert
  with check (auth.uid() = dentist_id);

create policy "Dentists can update their estimates"
  on cost_estimates for update
  using (auth.uid() = dentist_id);

create policy "Labs can update assigned estimates"
  on cost_estimates for update
  using (auth.uid() = lab_id);

-- Create orders table
create table orders (
  id uuid default uuid_generate_v4() primary key,
  dentist_id uuid references profiles(id) not null,
  lab_id uuid references profiles(id) not null,
  patient_id text not null,
  treatment_type text not null,
  description text not null,
  status order_status not null default 'pending',
  total_cost decimal(10,2) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  due_date timestamptz not null,
  impression_type text not null,
  scanner_type text,
  pickup_details jsonb,
  checkin_details jsonb,
  treatment_details jsonb not null
);

-- Create RLS policies for orders
alter table orders enable row level security;

create policy "Dentists can view their own orders"
  on orders for select
  using (auth.uid() = dentist_id);

create policy "Labs can view orders assigned to them"
  on orders for select
  using (auth.uid() = lab_id);

create policy "Dentists can create orders"
  on orders for insert
  with check (auth.uid() = dentist_id);

create policy "Dentists can update their orders"
  on orders for update
  using (auth.uid() = dentist_id);

create policy "Labs can update assigned orders"
  on orders for update
  using (auth.uid() = lab_id);

-- Create function to handle profile updates
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger set_profiles_updated_at
  before update on profiles
  for each row
  execute function handle_updated_at();

create trigger set_cost_estimates_updated_at
  before update on cost_estimates
  for each row
  execute function handle_updated_at();

create trigger set_orders_updated_at
  before update on orders
  for each row
  execute function handle_updated_at();

-- Create indexes for better query performance
create index idx_cost_estimates_dentist on cost_estimates(dentist_id);
create index idx_cost_estimates_lab on cost_estimates(lab_id);
create index idx_cost_estimates_status on cost_estimates(status);
create index idx_orders_dentist on orders(dentist_id);
create index idx_orders_lab on orders(lab_id);
create index idx_orders_status on orders(status);
create index idx_orders_due_date on orders(due_date);