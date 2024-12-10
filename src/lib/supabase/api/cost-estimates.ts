import { supabase } from '../client';
import type { CostEstimate } from '@/lib/types/cost-estimate';

export async function createCostEstimate(estimate: Omit<CostEstimate, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data, error } = await supabase
    .from('cost_estimates')
    .insert({
      dentist_id: estimate.dentist.id,
      lab_id: estimate.lab?.id,
      patient_id: estimate.patient.id,
      treatment_type: estimate.treatment.type,
      description: estimate.treatment.description,
      total_cost: estimate.totalCost || 0,
      lab_fees: estimate.labFees,
      status: estimate.status,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCostEstimate(id: string, updates: Partial<CostEstimate>) {
  const { error } = await supabase
    .from('cost_estimates')
    .update({
      lab_id: updates.lab?.id,
      total_cost: updates.totalCost,
      lab_fees: updates.labFees,
      status: updates.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw error;
}

export async function getCostEstimatesByDentist(dentistId: string) {
  const { data, error } = await supabase
    .from('cost_estimates')
    .select('*')
    .eq('dentist_id', dentistId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getCostEstimatesByLab(labId: string) {
  const { data, error } = await supabase
    .from('cost_estimates')
    .select('*')
    .eq('lab_id', labId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}