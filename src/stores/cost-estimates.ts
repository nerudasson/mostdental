import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CostEstimate } from '@/lib/types/cost-estimate';

interface CostEstimateStore {
  estimates: CostEstimate[];
  addEstimate: (estimate: CostEstimate) => void;
  updateEstimate: (id: string, updates: Partial<CostEstimate>) => void;
  getEstimatesByDentist: (dentistId: string) => CostEstimate[];
  getEstimatesByLab: (labId: string) => CostEstimate[];
  getPendingLabEstimates: () => CostEstimate[];
}

export const useCostEstimateStore = create<CostEstimateStore>()(
  persist(
    (set, get) => ({
      estimates: [],
      
      addEstimate: (estimate) => {
        set((state) => ({
          estimates: [...state.estimates, estimate],
        }));
      },
      
      updateEstimate: (id, updates) => {
        set((state) => ({
          estimates: state.estimates.map((estimate) =>
            estimate.id === id
              ? { ...estimate, ...updates, updatedAt: new Date() }
              : estimate
          ),
        }));
      },
      
      getEstimatesByDentist: (dentistId) => {
        return get().estimates.filter(
          (estimate) => estimate.dentist.id === dentistId
        );
      },
      
      getEstimatesByLab: (labId) => {
        return get().estimates.filter(
          (estimate) => estimate.lab?.id === labId
        );
      },
      
      getPendingLabEstimates: () => {
        return get().estimates.filter(
          (estimate) => estimate.status === 'pending_lab'
        );
      },
    }),
    {
      name: 'cost-estimates-storage',
    }
  )
);