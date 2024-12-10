import { supabase } from '../client';
import type { Order } from '@/lib/types/order';

export async function createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      dentist_id: order.dentistId,
      lab_id: order.labId,
      patient_id: order.patientId,
      treatment_type: order.treatment.type,
      description: order.treatment.description,
      status: order.status,
      total_cost: order.totalCost,
      due_date: order.dueDate.toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateOrder(id: string, updates: Partial<Order>) {
  const { error } = await supabase
    .from('orders')
    .update({
      status: updates.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw error;
}

export async function getOrdersByDentist(dentistId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('dentist_id', dentistId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getOrdersByLab(labId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('lab_id', labId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}