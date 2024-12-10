import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TreatmentPlan } from '@/lib/cost-estimation/types';

interface TreatmentPlanDraft {
  id: string;
  patientId: string;
  patientName: string;
  createdAt: Date;
  updatedAt: Date;
  plan: TreatmentPlan;
  gozFactor: number;
  selectedLab?: string;
}

interface TreatmentPlanStore {
  drafts: TreatmentPlanDraft[];
  saveDraft: (draft: Omit<TreatmentPlanDraft, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateDraft: (id: string, updates: Partial<TreatmentPlanDraft>) => void;
  getDraft: (id: string) => TreatmentPlanDraft | undefined;
  getDraftsByPatient: (patientId: string) => TreatmentPlanDraft[];
  deleteDraft: (id: string) => void;
}

export const useTreatmentPlanStore = create<TreatmentPlanStore>()(
  persist(
    (set, get) => ({
      drafts: [],
      
      saveDraft: (draft) => {
        const id = Math.random().toString(36).substring(2, 9);
        const now = new Date();
        
        const newDraft: TreatmentPlanDraft = {
          ...draft,
          id,
          createdAt: now,
          updatedAt: now,
        };
        
        set((state) => ({
          drafts: [...state.drafts, newDraft],
        }));
        
        return id;
      },
      
      updateDraft: (id, updates) => {
        set((state) => ({
          drafts: state.drafts.map((draft) =>
            draft.id === id
              ? { ...draft, ...updates, updatedAt: new Date() }
              : draft
          ),
        }));
      },
      
      getDraft: (id) => {
        return get().drafts.find((draft) => draft.id === id);
      },
      
      getDraftsByPatient: (patientId) => {
        return get().drafts.filter((draft) => draft.patientId === patientId);
      },
      
      deleteDraft: (id) => {
        set((state) => ({
          drafts: state.drafts.filter((draft) => draft.id !== id),
        }));
      },
    }),
    {
      name: 'treatment-plan-drafts',
    }
  )
);