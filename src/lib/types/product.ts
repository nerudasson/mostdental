import { z } from 'zod';
import { IndicationType } from './scanner';

export enum ProductCategory {
  CROWN = 'crown',
  BRIDGE = 'bridge',
  INLAY = 'inlay',
  ONLAY = 'onlay',
  VENEER = 'veneer',
  IMPLANT = 'implant',
}

export enum MaterialType {
  ZIRCONIA = 'zirconia',
  LITHIUM_DISILICATE = 'lithium_disilicate',
  METAL_CERAMIC = 'metal_ceramic',
  FULL_METAL = 'full_metal',
  COMPOSITE = 'composite',
}

export enum ManufacturingType {
  IN_HOUSE = 'in_house',
  OUTSOURCED = 'outsourced',
  HYBRID = 'hybrid',
}

export const productFeatureSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  included: z.boolean(),
});

export const productSchema = z.object({
  id: z.string(),
  labId: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.nativeEnum(ProductCategory),
  indication: z.nativeEnum(IndicationType),
  materialType: z.nativeEnum(MaterialType),
  manufacturingType: z.nativeEnum(ManufacturingType),
  manufacturingLocation: z.string(),
  features: z.array(productFeatureSchema),
  basePrice: z.number(),
  discountAmount: z.number().optional(),
  discountLabel: z.string().optional(),
  rating: z.number().min(0).max(5),
  reviewCount: z.number(),
  deliveryDays: z.number(),
  warranty: z.object({
    years: z.number(),
    description: z.string(),
  }),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type ProductFeature = z.infer<typeof productFeatureSchema>;
export type Product = z.infer<typeof productSchema>;