```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductionLine, ProductionUnit, ProductionStep } from '@/lib/types/production';
import { notificationService } from '@/lib/notifications/service';
import { NotificationType } from '@/lib/notifications/types';

interface ProductionStore {
  productionLines: ProductionLine[];
  productionUnits: ProductionUnit[];
  
  // Production Line Management
  addProductionLine: (line: Omit<ProductionLine, 'id'>) => string;
  updateProductionLine: (id: string, updates: Partial<ProductionLine>) => void;
  deleteProductionLine: (id: string) => void;
  getProductionLinesByIndication: (indication: string) => ProductionLine[];
  
  // Production Unit Management
  createProductionUnit: (params: {
    orderId: string;
    productionLineId: string;
    autoAssign?: boolean;
  }) => ProductionUnit;
  updateProductionUnit: (id: string, updates: Partial<ProductionUnit>) => void;
  assignTechnician: (params: {
    unitId: string;
    stepId: string;
    technicianId: string;
  }) => void;
  completeStep: (params: {
    unitId: string;
    stepId: string;
    notes?: string;
  }) => void;
  getProductionUnitsByTechnician: (technicianId: string) => ProductionUnit[];
  getProductionUnitsByOrder: (orderId: string) => ProductionUnit[];
}

export const useProductionStore = create<ProductionStore>()(
  persist(
    (set, get) => ({
      productionLines: [],
      productionUnits: [],

      addProductionLine: (line) => {
        const id = crypto.randomUUID();
        set((state) => ({
          productionLines: [...state.productionLines, { ...line, id }],
        }));
        return id;
      },

      updateProductionLine: (id, updates) => {
        set((state) => ({
          productionLines: state.productionLines.map((line) =>
            line.id === id ? { ...line, ...updates } : line
          ),
        }));
      },

      deleteProductionLine: (id) => {
        set((state) => ({
          productionLines: state.productionLines.filter((line) => line.id !== id),
        }));
      },

      getProductionLinesByIndication: (indication) => {
        return get().productionLines.filter((line) =>
          line.indications.includes(indication)
        );
      },

      createProductionUnit: ({ orderId, productionLineId, autoAssign }) => {
        const line = get().productionLines.find((l) => l.id === productionLineId);
        if (!line) throw new Error('Production line not found');

        const unit: ProductionUnit = {
          id: crypto.randomUUID(),
          orderId,
          productionLineId,
          status: 'pending',
          startedAt: new Date(),
          steps: line.steps.map((step) => ({
            id: crypto.randomUUID(),
            stepId: step.id,
            status: 'pending',
            assignedTechnicianId: autoAssign && step.autoAssign ? step.assignedTechnicianId : undefined,
          })),
        };

        set((state) => ({
          productionUnits: [...state.productionUnits, unit],
        }));

        // Notify assigned technicians
        unit.steps.forEach((step) => {
          if (step.assignedTechnicianId) {
            notificationService.notify({
              type: NotificationType.PRODUCTION_ASSIGNED,
              recipientId: step.assignedTechnicianId,
              recipientRole: 'lab',
              data: {
                orderId,
                stepName: line.steps.find((s) => s.id === step.stepId)?.name,
              },
            });
          }
        });

        return unit;
      },

      updateProductionUnit: (id, updates) => {
        set((state) => ({
          productionUnits: state.productionUnits.map((unit) =>
            unit.id === id ? { ...unit, ...updates } : unit
          ),
        }));
      },

      assignTechnician: ({ unitId, stepId, technicianId }) => {
        set((state) => ({
          productionUnits: state.productionUnits.map((unit) =>
            unit.id === unitId
              ? {
                  ...unit,
                  steps: unit.steps.map((step) =>
                    step.stepId === stepId
                      ? { ...step, assignedTechnicianId: technicianId }
                      : step
                  ),
                }
              : unit
          ),
        }));

        // Notify technician
        const unit = get().productionUnits.find((u) => u.id === unitId);
        const line = unit && get().productionLines.find((l) => l.id === unit.productionLineId);
        if (unit && line) {
          notificationService.notify({
            type: NotificationType.PRODUCTION_ASSIGNED,
            recipientId: technicianId,
            recipientRole: 'lab',
            data: {
              orderId: unit.orderId,
              stepName: line.steps.find((s) => s.id === stepId)?.name,
            },
          });
        }
      },

      completeStep: ({ unitId, stepId, notes }) => {
        const now = new Date();
        set((state) => ({
          productionUnits: state.productionUnits.map((unit) => {
            if (unit.id !== unitId) return unit;

            const updatedSteps = unit.steps.map((step) =>
              step.stepId === stepId
                ? { ...step, status: 'completed', completedAt: now, notes }
                : step
            );

            // Check if all steps are completed
            const allCompleted = updatedSteps.every((s) => s.status === 'completed');

            return {
              ...unit,
              steps: updatedSteps,
              status: allCompleted ? 'completed' : 'in_progress',
              completedAt: allCompleted ? now : undefined,
            };
          }),
        }));
      },

      getProductionUnitsByTechnician: (technicianId) => {
        return get().productionUnits.filter((unit) =>
          unit.steps.some((step) => step.assignedTechnicianId === technicianId)
        );
      },

      getProductionUnitsByOrder: (orderId) => {
        return get().productionUnits.filter((unit) => unit.orderId === orderId);
      },
    }),
    {
      name: 'production-storage',
    }
  )
);
```