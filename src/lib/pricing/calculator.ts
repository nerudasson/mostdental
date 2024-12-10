import { InsuranceType, CoverageLevel } from '../cost-estimation/types';
import type { HKPCode } from '../types/hkp';
import type { BEBPosition, BELPosition, Material, LabPricingConfig } from './types';

interface PositionCost {
  code: string;
  description: string;
  basePrice: number;
  finalPrice: number;
  quantity: number;
  total: number;
}

interface MaterialCost {
  name: string;
  basePrice: number;
  surcharge: number;
  finalPrice: number;
  quantity: number;
  total: number;
}

export interface CostBreakdown {
  positions: PositionCost[];
  materials: MaterialCost[];
  subtotal: number;
  materialSurcharges: number;
  total: number;
}

export class LabPriceCalculator {
  constructor(private config: LabPricingConfig) {}

  calculateCosts(params: {
    befunde: Record<string, HKPCode>;
    insuranceType: InsuranceType;
    coverageLevel: CoverageLevel;
    indication: string;
    materialType: string;
  }): CostBreakdown {
    const { befunde, insuranceType, coverageLevel, indication, materialType } = params;

    // Get applicable positions based on coverage level
    const positions = this.getApplicablePositions(befunde, coverageLevel);
    
    // Calculate position costs
    const positionCosts = positions.map(pos => this.calculatePositionCost(pos));
    
    // Calculate material costs
    const materialCosts = this.calculateMaterialCosts(indication, materialType);

    // Calculate totals
    const subtotal = positionCosts.reduce((sum, pos) => sum + pos.total, 0);
    const materialSurcharges = materialCosts.reduce((sum, mat) => sum + mat.total, 0);
    const total = subtotal + materialSurcharges;

    return {
      positions: positionCosts,
      materials: materialCosts,
      subtotal,
      materialSurcharges,
      total,
    };
  }

  private getApplicablePositions(
    befunde: Record<string, HKPCode>,
    coverageLevel: CoverageLevel
  ): Array<BEBPosition | BELPosition> {
    // Map HKP codes to BEB/BEL positions based on coverage level
    const positions: Array<BEBPosition | BELPosition> = [];
    
    Object.entries(befunde).forEach(([tooth, code]) => {
      if (coverageLevel === CoverageLevel.STANDARD) {
        // Use BEL positions for standard coverage
        const belPositions = this.mapHKPToBEL(code);
        positions.push(...belPositions);
      } else {
        // Use BEB positions for same/different type
        const bebPositions = this.mapHKPToBEB(code);
        positions.push(...bebPositions);
      }
    });

    return positions;
  }

  private calculatePositionCost(position: BEBPosition | BELPosition): PositionCost {
    if ('points' in position) {
      // BEL position
      const basePrice = position.points * this.config.belPointValue;
      const finalPrice = basePrice * position.regionFactor;
      
      return {
        code: position.code,
        description: position.description,
        basePrice,
        finalPrice,
        quantity: 1,
        total: finalPrice,
      };
    } else {
      // BEB position
      const basePrice = position.customPrice || position.basePrice;
      const finalPrice = basePrice * position.regionFactor;
      
      return {
        code: position.code,
        description: position.description,
        basePrice,
        finalPrice,
        quantity: 1,
        total: finalPrice,
      };
    }
  }

  private calculateMaterialCosts(
    indication: string,
    materialType: string
  ): MaterialCost[] {
    const materials = this.config.materials.filter(
      m => m.indication === indication && m.type === materialType
    );

    return materials.map(material => {
      const basePrice = this.getBaseMaterialPrice(material.type);
      const surcharge = material.isBaseMaterial ? 0 : 
        (basePrice * (material.surchargePercentage / 100));
      const finalPrice = basePrice + surcharge;

      return {
        name: material.name,
        basePrice,
        surcharge,
        finalPrice,
        quantity: 1,
        total: finalPrice,
      };
    });
  }

  private mapHKPToBEL(code: HKPCode): BELPosition[] {
    // Implementation depends on specific BEL mappings
    return [];
  }

  private mapHKPToBEB(code: HKPCode): BEBPosition[] {
    // Implementation depends on specific BEB mappings
    return [];
  }

  private getBaseMaterialPrice(materialType: string): number {
    // Get base price for material type from config
    return 0;
  }
}