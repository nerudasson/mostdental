import type { HKPCode } from '../types/hkp';

export enum InsuranceType {
  PUBLIC = 'gesetzlich',
  PRIVATE = 'privat',
}

export enum CoverageLevel {
  STANDARD = 'Regelversorgung',
  SAME_TYPE = 'gleichartige Versorgung',
  DIFFERENT_TYPE = 'andersartige Versorgung',
}

export enum MaterialType {
  // Metal Materials
  NEM = 'Nichtedelmetall',
  GOLD = 'Goldlegierung',
  TITANIUM = 'Titan',
  
  // Ceramic Materials
  ZIRCONIA = 'Zirkonoxid',
  LITHIUM_DISILICATE = 'Lithiumdisilikat',
  SILICATE_CERAMIC = 'Silikatkeramik',
  
  // Veneering Materials
  CERAMIC_VENEER = 'Verblendkeramik',
  COMPOSITE_VENEER = 'Kompositverblendung',
}

export interface Position {
  code: string;
  points: number;
  description: string;
  type: 'BEMA' | 'GOZ';
  factor?: number;
}

export interface CostBreakdown {
  positions: Position[];
  totalBema: number;
  totalGoz: number;
  materialCosts: Array<[string, number, number]>; // [description, price, quantity]
  shippingCosts: number;
  total: number;
}

export interface TreatmentPlan {
  name: string;
  befunde: Record<string, HKPCode>;
  regelversorgung: Record<string, HKPCode>;
  therapie: Record<string, HKPCode>;
  description: string;
  estimatedCost: number;
  festzuschuss: number;
  patientPortion: number;
  materialType: MaterialType;
  coverageLevel: CoverageLevel;
  advantages: string[];
  disadvantages: string[];
  maintenanceInterval: number; // months
  estimatedLifespan: number; // years
  costs: CostBreakdown;
}