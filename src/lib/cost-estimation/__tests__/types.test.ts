import { describe, it, expect } from 'vitest';
import { 
  InsuranceType, 
  CoverageLevel, 
  MaterialType,
  type TreatmentPlan,
  type CostBreakdown,
  type Position 
} from '@/lib/types';

describe('Cost Estimation Types', () => {
  describe('InsuranceType', () => {
    it('should have correct values', () => {
      expect(InsuranceType.PUBLIC).toBe('gesetzlich');
      expect(InsuranceType.PRIVATE).toBe('privat');
    });
  });

  describe('CoverageLevel', () => {
    it('should have correct values', () => {
      expect(CoverageLevel.STANDARD).toBe('Regelversorgung');
      expect(CoverageLevel.SAME_TYPE).toBe('gleichartige Versorgung');
      expect(CoverageLevel.DIFFERENT_TYPE).toBe('andersartige Versorgung');
    });
  });

  describe('MaterialType', () => {
    it('should have correct values', () => {
      expect(MaterialType.NEM).toBe('Nichtedelmetall');
      expect(MaterialType.GOLD).toBe('Goldlegierung');
      expect(MaterialType.TITANIUM).toBe('Titan');
      expect(MaterialType.ZIRCONIA).toBe('Zirkonoxid');
      expect(MaterialType.LITHIUM_DISILICATE).toBe('Lithiumdisilikat');
      expect(MaterialType.SILICATE_CERAMIC).toBe('Silikatkeramik');
      expect(MaterialType.CERAMIC_VENEER).toBe('Verblendkeramik');
      expect(MaterialType.COMPOSITE_VENEER).toBe('Kompositverblendung');
    });
  });

  describe('Type Structures', () => {
    it('should validate Position structure', () => {
      const position: Position = {
        code: '5040',
        points: 20,
        description: 'Vollkrone',
        type: 'GOZ',
        factor: 2.3,
      };

      expect(position.code).toBeDefined();
      expect(position.points).toBeDefined();
      expect(position.description).toBeDefined();
      expect(position.type).toBeDefined();
      expect(position.factor).toBeDefined();
    });

    it('should validate CostBreakdown structure', () => {
      const costBreakdown: CostBreakdown = {
        positions: [
          {
            code: '5040',
            points: 20,
            description: 'Vollkrone',
            type: 'GOZ',
            factor: 2.3,
          },
        ],
        totalBema: 0,
        totalGoz: 500,
        materialCosts: [['Zirkon', 200, 1]],
        shippingCosts: 0,
        total: 700,
      };

      expect(costBreakdown.positions).toBeDefined();
      expect(costBreakdown.totalBema).toBeDefined();
      expect(costBreakdown.totalGoz).toBeDefined();
      expect(costBreakdown.materialCosts).toBeDefined();
      expect(costBreakdown.shippingCosts).toBeDefined();
      expect(costBreakdown.total).toBeDefined();
    });

    it('should validate TreatmentPlan structure', () => {
      const treatmentPlan: TreatmentPlan = {
        name: 'Metallkeramische Brücke',
        befunde: { '11': 'f' },
        regelversorgung: { '11': 'B' },
        therapie: { '11': 'B' },
        description: 'Brücke aus Nichtedelmetall mit Keramikverblendung',
        estimatedCost: 1000,
        festzuschuss: 500,
        patientPortion: 500,
        materialType: MaterialType.NEM,
        coverageLevel: CoverageLevel.STANDARD,
        advantages: ['Bewährte Standardlösung'],
        disadvantages: ['Metallgerüst kann durchschimmern'],
        maintenanceInterval: 6,
        estimatedLifespan: 15,
        costs: {
          positions: [],
          totalBema: 0,
          totalGoz: 1000,
          materialCosts: [],
          shippingCosts: 0,
          total: 1000,
        },
      };

      expect(treatmentPlan.name).toBeDefined();
      expect(treatmentPlan.befunde).toBeDefined();
      expect(treatmentPlan.regelversorgung).toBeDefined();
      expect(treatmentPlan.therapie).toBeDefined();
      expect(treatmentPlan.description).toBeDefined();
      expect(treatmentPlan.estimatedCost).toBeDefined();
      expect(treatmentPlan.festzuschuss).toBeDefined();
      expect(treatmentPlan.patientPortion).toBeDefined();
      expect(treatmentPlan.materialType).toBeDefined();
      expect(treatmentPlan.coverageLevel).toBeDefined();
      expect(treatmentPlan.advantages).toBeDefined();
      expect(treatmentPlan.disadvantages).toBeDefined();
      expect(treatmentPlan.maintenanceInterval).toBeDefined();
      expect(treatmentPlan.estimatedLifespan).toBeDefined();
      expect(treatmentPlan.costs).toBeDefined();
    });
  });
});