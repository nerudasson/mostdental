import { describe, it, expect, beforeEach } from 'vitest';
import { CostEstimationCalculator } from '../calculator';
import { 
  InsuranceType, 
  CoverageLevel, 
  MaterialType,
  type HKPCode 
} from '@/lib/types';

describe('CostEstimationCalculator', () => {
  let calculator: CostEstimationCalculator;

  beforeEach(() => {
    calculator = new CostEstimationCalculator();
  });

  describe('calculateFestzuschuss', () => {
    it('should calculate correct Festzuschuss for single missing front tooth', () => {
      const befunde: Record<string, HKPCode> = {
        '11': 'f',
      };

      const festzuschuss = calculator['calculateFestzuschuss'](befunde, 10);
      expect(festzuschuss).toBe(580 * 1.15); // Base amount + 15% bonus
    });

    it('should calculate correct Festzuschuss for single missing back tooth', () => {
      const befunde: Record<string, HKPCode> = {
        '16': 'f',
      };

      const festzuschuss = calculator['calculateFestzuschuss'](befunde, 10);
      expect(festzuschuss).toBe(500 * 1.15); // Base amount + 15% bonus
    });

    it('should calculate correct Festzuschuss for multiple missing teeth', () => {
      const befunde: Record<string, HKPCode> = {
        '14': 'f',
        '15': 'f',
        '16': 'f',
      };

      const festzuschuss = calculator['calculateFestzuschuss'](befunde, 10);
      expect(festzuschuss).toBe(874.50 * 1.15); // Base amount + 15% bonus
    });

    it('should apply correct bonus percentage based on years', () => {
      const befunde: Record<string, HKPCode> = { '11': 'f' };

      expect(calculator['calculateFestzuschuss'](befunde, 4)).toBe(580); // No bonus
      expect(calculator['calculateFestzuschuss'](befunde, 5)).toBe(580 * 1.10); // 10% bonus
      expect(calculator['calculateFestzuschuss'](befunde, 10)).toBe(580 * 1.15); // 15% bonus
    });
  });

  describe('determineRegelversorgung', () => {
    it('should determine correct Regelversorgung for missing tooth', () => {
      const befunde: Record<string, HKPCode> = {
        '14': 'f',
        '13': 'k',
        '15': 'k',
      };

      const regelversorgung = calculator['determineRegelversorgung'](befunde);
      
      expect(regelversorgung['14']).toBe('B'); // Bridge pontic
      expect(regelversorgung['13']).toBe('KB'); // Crown as bridge anchor
      expect(regelversorgung['15']).toBe('KB'); // Crown as bridge anchor
    });

    it('should handle carious teeth', () => {
      const befunde: Record<string, HKPCode> = {
        '11': 'k',
        '12': 'kw',
      };

      const regelversorgung = calculator['determineRegelversorgung'](befunde);
      
      expect(regelversorgung['11']).toBe('K'); // Crown
      expect(regelversorgung['12']).toBe('K'); // Crown
    });

    it('should handle teeth requiring extraction', () => {
      const befunde: Record<string, HKPCode> = {
        '21': 'x',
        '22': 'w',
      };

      const regelversorgung = calculator['determineRegelversorgung'](befunde);
      
      expect(regelversorgung['21']).toBe('E'); // Extraction
      expect(regelversorgung['22']).toBe('E'); // Extraction
    });
  });

  describe('generatePositions', () => {
    it('should generate correct positions for crown', () => {
      const befunde: Record<string, HKPCode> = {
        '11': 'k',
      };

      const positions = calculator['generatePositions'](befunde, MaterialType.NEM);
      
      // Check for required positions
      const codes = positions.map(p => p.code);
      expect(codes).toContain('89'); // Impression
      expect(codes).toContain('91b'); // Bite registration
      expect(codes).toContain('5070'); // Preparation
      expect(codes).toContain('5040'); // Full crown
      expect(codes).toContain('98a'); // Try-in
      expect(codes).toContain('98d'); // Insertion
      expect(codes).toContain('2197'); // Adhesive cementation
    });

    it('should generate correct positions for bridge', () => {
      const befunde: Record<string, HKPCode> = {
        '11': 'k',
        '12': 'f',
        '13': 'k',
      };

      const positions = calculator['generatePositions'](befunde, MaterialType.NEM);
      
      // Check for bridge-specific positions
      const codes = positions.map(p => p.code);
      expect(codes).toContain('5120'); // Bridge pontic
      
      // Count occurrences
      const preparationCount = positions.filter(p => p.code === '5070').length;
      expect(preparationCount).toBe(2); // Two preparations for abutment teeth
    });
  });

  describe('calculateCosts', () => {
    it('should calculate correct totals for BEMA and GOZ positions', () => {
      const positions = [
        { code: '89', points: 4, description: 'Abformung', type: 'BEMA' as const },
        { code: '5070', points: 13, description: 'Präparation', type: 'GOZ' as const },
      ];

      const costs = calculator['calculateCosts'](positions, 2.3);
      
      expect(costs.totalBema).toBe(4 * 1.0); // BEMA point value = 1.0
      expect(costs.totalGoz).toBe(13 * 1.2 * 2.3); // GOZ point value = 1.2, factor = 2.3
    });

    it('should apply correct GOZ factor', () => {
      const positions = [
        { code: '5070', points: 13, description: 'Präparation', type: 'GOZ' as const },
      ];

      const costs1 = calculator['calculateCosts'](positions, 2.3);
      const costs2 = calculator['calculateCosts'](positions, 3.5);
      
      expect(costs2.totalGoz).toBeGreaterThan(costs1.totalGoz);
      expect(costs2.totalGoz / costs1.totalGoz).toBeCloseTo(3.5 / 2.3);
    });
  });

  describe('generateTreatmentOptions', () => {
    it('should generate all coverage level options', () => {
      const befunde: Record<string, HKPCode> = {
        '11': 'f',
        '21': 'k',
      };

      const options = calculator.calculateTreatmentOptions(
        befunde,
        InsuranceType.PUBLIC,
        10,
        false
      );

      expect(options[CoverageLevel.STANDARD]).toBeDefined();
      expect(options[CoverageLevel.SAME_TYPE]).toBeDefined();
      expect(options[CoverageLevel.DIFFERENT_TYPE]).toBeDefined();
    });

    it('should include correct material types for each coverage level', () => {
      const befunde: Record<string, HKPCode> = {
        '11': 'f',
      };

      const options = calculator.calculateTreatmentOptions(
        befunde,
        InsuranceType.PUBLIC,
        10,
        false
      );

      expect(options[CoverageLevel.STANDARD][0].materialType).toBe(MaterialType.NEM);
      expect(options[CoverageLevel.SAME_TYPE][0].materialType).toBe(MaterialType.ZIRCONIA);
      expect(options[CoverageLevel.DIFFERENT_TYPE][0].materialType).toBe(MaterialType.TITANIUM);
    });

    it('should calculate correct patient portion', () => {
      const befunde: Record<string, HKPCode> = {
        '11': 'f',
      };

      const options = calculator.calculateTreatmentOptions(
        befunde,
        InsuranceType.PUBLIC,
        10,
        false
      );

      const standardOption = options[CoverageLevel.STANDARD][0];
      expect(standardOption.patientPortion).toBe(
        standardOption.estimatedCost - standardOption.festzuschuss
      );
    });

    it('should handle additional insurance', () => {
      const befunde: Record<string, HKPCode> = {
        '11': 'f',
      };

      const optionsWithoutInsurance = calculator.calculateTreatmentOptions(
        befunde,
        InsuranceType.PUBLIC,
        10,
        false
      );

      const optionsWithInsurance = calculator.calculateTreatmentOptions(
        befunde,
        InsuranceType.PUBLIC,
        10,
        true
      );

      // Additional insurance should not affect Festzuschuss
      expect(optionsWithInsurance[CoverageLevel.STANDARD][0].festzuschuss)
        .toBe(optionsWithoutInsurance[CoverageLevel.STANDARD][0].festzuschuss);
    });
  });
});