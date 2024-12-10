import { z } from 'zod';
import { IndicationType } from '../scanner/types';

export enum BEBCategory {
  BASIC = 'basic',
  PREPARATION = 'preparation',
  FRAMEWORK = 'framework',
  CERAMIC = 'ceramic',
  FINISHING = 'finishing',
  EXPRESS = 'express'
}

export const materialTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  description: z.string().optional(),
  category: z.string(),
  isActive: z.boolean().default(true),
});

export const materialSchema = z.object({
  id: z.string(),
  name: z.string(),
  typeId: z.string(),
  indication: z.nativeEnum(IndicationType),
  isBaseMaterial: z.boolean(),
  surchargePercentage: z.number().min(0),
  notes: z.string().optional(),
});

export const bebPositionSchema = z.object({
  code: z.string(),
  description: z.string(),
  category: z.nativeEnum(BEBCategory),
  basePrice: z.number().min(0),
  regionFactor: z.number().min(0.8).max(1.5),
  customPrice: z.number().optional(),
  enabled: z.boolean().default(true),
});

export const belPositionSchema = z.object({
  code: z.string(),
  description: z.string(),
  points: z.number().min(0),
  regionFactor: z.number().min(0.8).max(1.5),
});

export const labPricingConfigSchema = z.object({
  autoAcceptEstimates: z.boolean().default(false),
  belPointValue: z.number().min(0),
  defaultRegionFactor: z.number().min(0.8).max(1.5),
  materialTypes: z.array(materialTypeSchema),
  materials: z.array(materialSchema),
  bebPositions: z.record(bebPositionSchema),
  belPositions: z.record(belPositionSchema),
  customPrices: z.record(z.number()),
});

export type MaterialType = z.infer<typeof materialTypeSchema>;
export type Material = z.infer<typeof materialSchema>;
export type BEBPosition = z.infer<typeof bebPositionSchema>;
export type BELPosition = z.infer<typeof belPositionSchema>;
export type LabPricingConfig = z.infer<typeof labPricingConfigSchema>;