-- First create auth users
insert into auth.users (id, email, created_at, updated_at)
values
  ('d5b2aa90-d9d0-4c6c-9b8f-f0f3b0c4a123', 'dr.smith@example.com', now(), now()),
  ('d5b2aa90-d9d0-4c6c-9b8f-f0f3b0c4a124', 'dr.jones@example.com', now(), now()),
  ('85b2aa90-d9d0-4c6c-9b8f-f0f3b0c4a123', 'bestlab@example.com', now(), now()),
  ('85b2aa90-d9d0-4c6c-9b8f-f0f3b0c4a124', 'premiumdental@example.com', now(), now());

-- Then create identities for the users
insert into auth.identities (id, user_id, identity_data, provider, created_at, updated_at)
select 
  uuid_generate_v4(),
  id,
  jsonb_build_object('sub', id, 'email', email),
  'email',
  now(),
  now()
from auth.users;

-- Now we can safely insert profiles
insert into profiles (id, email, full_name, role, practice_name, created_at, updated_at)
values
  ('d5b2aa90-d9d0-4c6c-9b8f-f0f3b0c4a123', 'dr.smith@example.com', 'Dr. Sarah Smith', 'dentist', 'Smith Dental Practice', now(), now()),
  ('d5b2aa90-d9d0-4c6c-9b8f-f0f3b0c4a124', 'dr.jones@example.com', 'Dr. Michael Jones', 'dentist', 'City Dental Care', now(), now());

insert into profiles (id, email, full_name, role, lab_name, created_at, updated_at)
values
  ('85b2aa90-d9d0-4c6c-9b8f-f0f3b0c4a123', 'bestlab@example.com', 'Best Lab Admin', 'lab', 'Best Lab', now(), now()),
  ('85b2aa90-d9d0-4c6c-9b8f-f0f3b0c4a124', 'premiumdental@example.com', 'Premium Dental Admin', 'lab', 'Premium Dental', now(), now());

-- Seed example cost estimates
insert into cost_estimates (
  dentist_id,
  lab_id,
  patient_id,
  treatment_type,
  description,
  total_cost,
  lab_fees,
  status,
  befunde,
  regelversorgung,
  therapie,
  notes
)
values
  (
    'd5b2aa90-d9d0-4c6c-9b8f-f0f3b0c4a123',
    '85b2aa90-d9d0-4c6c-9b8f-f0f3b0c4a123',
    'P001',
    'Bridge Metal',
    'Bridge 13-15',
    1250.00,
    450.00,
    'pending_lab',
    '{"13": "k", "14": "f", "15": "k"}'::jsonb,
    '{"13": "KB", "14": "B", "15": "KB"}'::jsonb,
    '{"13": "KB", "14": "B", "15": "KB"}'::jsonb,
    'Patient prefers metal over ceramic due to cost considerations'
  ),
  (
    'd5b2aa90-d9d0-4c6c-9b8f-f0f3b0c4a124',
    '85b2aa90-d9d0-4c6c-9b8f-f0f3b0c4a124',
    'P002',
    'Crown Ceramic',
    'Crown 16',
    950.00,
    350.00,
    'priced',
    '{"16": "k"}'::jsonb,
    '{"16": "K"}'::jsonb,
    '{"16": "KZ"}'::jsonb,
    'High translucency zirconia requested'
  );

-- Seed example orders
insert into orders (
  dentist_id,
  lab_id,
  patient_id,
  treatment_type,
  description,
  status,
  total_cost,
  due_date,
  impression_type,
  scanner_type,
  treatment_details
)
values
  (
    'd5b2aa90-d9d0-4c6c-9b8f-f0f3b0c4a123',
    '85b2aa90-d9d0-4c6c-9b8f-f0f3b0c4a123',
    'P001',
    'Bridge Metal',
    'Bridge 13-15',
    'in_progress',
    1250.00,
    now() + interval '14 days',
    'digital_scan',
    'trios',
    '{
      "teeth": ["13", "14", "15"],
      "material": "metal_ceramic",
      "shade": "A2",
      "notes": "Please ensure proper occlusion"
    }'::jsonb
  ),
  (
    'd5b2aa90-d9d0-4c6c-9b8f-f0f3b0c4a124',
    '85b2aa90-d9d0-4c6c-9b8f-f0f3b0c4a124',
    'P002',
    'Crown Ceramic',
    'Crown 16',
    'pending_checkin',
    950.00,
    now() + interval '10 days',
    'physical',
    null,
    '{
      "teeth": ["16"],
      "material": "zirconia",
      "shade": "A3",
      "notes": "High translucency zirconia requested"
    }'::jsonb
  );