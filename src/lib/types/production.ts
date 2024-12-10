```typescript
import { z } from 'zod';
import { IndicationType } from '../scanner/types';

export enum ProductionStepType {
  SCAN_PROCESSING = 'scan_processing',
  DESIGN = 'design',
  MILLING = 'milling',
  SINTERING = 'sintering',
  STAINING = 'staining',
  GLAZING = 'glazing',
  QA = 'qa',
  FINISHING = 'finishing'
}

export const productionStepSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(ProductionStepType),
  description: z.string().optional(),
  duration: z.number(), // in minutes
  requiresTechnician: z.boolean(),
  autoAssign: z.boolean().default(false),
  assignedTechnicianId: z.string().optional(),
});

export const productionLineSchema = z.object({
  id: z.string(),
  name: z.string(),
  indications: z.array(z.nativeEnum(IndicationType)),
  description: z.string().optional(),
  steps: z.array(productionStepSchema),
  isDefault: z.boolean().default(false),
  autoAssignEnabled: z.boolean().default(false),
});

export const productionUnitSchema = z.object({
  id: z.string(),
  orderId: string,
  productionLineId: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed', 'on_hold']),
  currentStepId: z.string().optional(),
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
  steps: z.array(z.object({
    id: z.string(),
    stepId: z.string(),
    status: z.enum(['pending', 'in_progress', 'completed', 'on_hold']),
    assignedTechnicianId: z.string().optional(),
    startedAt: z.date().optional(),
    completedAt: z.date().optional(),
    notes: z.string().optional(),
  })),
});

export type ProductionStep = z.infer<typeof productionStepSchema>;
export type ProductionLine = z.infer<typeof productionLineSchema>;
export type ProductionUnit = z.infer<typeof productionUnitSchema>;
```