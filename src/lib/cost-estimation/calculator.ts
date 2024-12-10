import { 
  InsuranceType, 
  CoverageLevel, 
  MaterialType, 
  TreatmentPlan,
  CostBreakdown 
} from './types';
import type { HKPCode } from '@/lib/types/hkp';

const BEMA_POINT_VALUE = 1.0;
const GOZ_POINT_VALUE = 1.2;

interface Position {
  code: string;
  points: number;
  description: string;
  type: 'BEMA' | 'GOZ';
}

const BEMA_POSITIONS: Record<string, Position> = {
  '89': { code: '89', points: 4, description: 'Abformung', type: 'BEMA' },
  '91b': { code: '91b', points: 3, description: 'Bissregistrierung', type: 'BEMA' },
  '98a': { code: '98a', points: 7, description: 'Einprobe', type: 'BEMA' },
  '98d': { code: '98d', points: 9, description: 'Eingliederung', type: 'BEMA' },
};

const GOZ_POSITIONS: Record<string, Position> = {
  '2197': { code: '2197', points: 7, description: 'Adhäsive Befestigung', type: 'GOZ' },
  '5070': { code: '5070', points: 13, description: 'Präparation', type: 'GOZ' },
  '5040': { code: '5040', points: 20, description: 'Vollkrone', type: 'GOZ' },
  '5120': { code: '5120', points: 24, description: 'Brückenglied', type: 'GOZ' },
};

export class CostEstimationCalculator {
  calculateTreatmentOptions(
    befunde: Record<string, HKPCode>,
    insuranceType: InsuranceType,
    bonusYears: number = 0,
    hasAdditionalInsurance: boolean = false
  ): Record<CoverageLevel, TreatmentPlan[]> {
    const festzuschuss = this.calculateFestzuschuss(befunde, bonusYears);
    const regelversorgung = this.determineRegelversorgung(befunde);

    return {
      [CoverageLevel.STANDARD]: this.generateStandardOptions(befunde, regelversorgung, festzuschuss),
      [CoverageLevel.SAME_TYPE]: this.generateSameTypeOptions(befunde, regelversorgung, festzuschuss),
      [CoverageLevel.DIFFERENT_TYPE]: this.generateDifferentTypeOptions(befunde, regelversorgung, festzuschuss),
    };
  }

  private calculateFestzuschuss(
    befunde: Record<string, HKPCode>,
    bonusYears: number
  ): number {
    let baseAmount = 0;
    const missingTeeth = Object.entries(befunde)
      .filter(([_, code]) => ['f', 'e'].includes(code))
      .map(([tooth]) => parseInt(tooth));

    const bonusPercentage = bonusYears >= 10 ? 0.15 : 
                           bonusYears >= 5 ? 0.10 : 0;

    if (missingTeeth.length === 1) {
      baseAmount = this.isInFrontRegion(missingTeeth[0]) ? 580 : 500;
    } else if (missingTeeth.length <= 4) {
      baseAmount = 874.50;
    } else {
      baseAmount = 1100;
    }

    return baseAmount * (1 + bonusPercentage);
  }

  private determineRegelversorgung(befunde: Record<string, HKPCode>): Record<string, HKPCode> {
    const regelversorgung: Record<string, HKPCode> = {};
    
    Object.entries(befunde).forEach(([toothId, befund]) => {
      switch (befund) {
        case 'f':
          regelversorgung[toothId] = 'B';
          const tooth = parseInt(toothId);
          [-1, 1].forEach(offset => {
            const adjacentTooth = (tooth + offset).toString();
            if (befunde[adjacentTooth] && !befunde[adjacentTooth].includes('f')) {
              regelversorgung[adjacentTooth] = 'KB';
            }
          });
          break;
        case 'k':
          regelversorgung[toothId] = 'K';
          break;
        case 'kw':
          regelversorgung[toothId] = 'K';
          break;
        case 'x':
        case 'w':
          regelversorgung[toothId] = 'E';
          break;
      }
    });

    return regelversorgung;
  }

  private generatePositions(
    befunde: Record<string, HKPCode>,
    materialType: MaterialType
  ): Position[] {
    const positions: Position[] = [];
    const teethCount = Object.keys(befunde).length;

    // Add standard positions
    positions.push(BEMA_POSITIONS['89']); // Abformung
    positions.push(BEMA_POSITIONS['91b']); // Bissregistrierung

    // Add treatment specific positions
    Object.entries(befunde).forEach(([tooth, befund]) => {
      if (befund === 'k' || befund === 'kw') {
        positions.push(GOZ_POSITIONS['5070']); // Präparation
        positions.push(GOZ_POSITIONS['5040']); // Vollkrone
      } else if (befund === 'f') {
        positions.push(GOZ_POSITIONS['5120']); // Brückenglied
      }
    });

    // Add final positions
    positions.push(BEMA_POSITIONS['98a']); // Einprobe
    positions.push(BEMA_POSITIONS['98d']); // Eingliederung
    positions.push(GOZ_POSITIONS['2197']); // Adhäsive Befestigung

    return positions;
  }

  private calculateCosts(
    positions: Position[],
    gozFactor: number = 2.3
  ): CostBreakdown {
    let totalBema = 0;
    let totalGoz = 0;

    positions.forEach(pos => {
      if (pos.type === 'BEMA') {
        totalBema += pos.points * BEMA_POINT_VALUE;
      } else {
        totalGoz += pos.points * GOZ_POINT_VALUE * gozFactor;
      }
    });

    return {
      positions,
      totalBema,
      totalGoz,
      materialCosts: [],
      shippingCosts: 0,
      total: totalBema + totalGoz,
    };
  }

  private isInFrontRegion(toothNumber: number): boolean {
    return (toothNumber >= 13 && toothNumber <= 23) || 
           (toothNumber >= 33 && toothNumber <= 43);
  }

  private generateStandardOptions(
    befunde: Record<string, HKPCode>,
    regelversorgung: Record<string, HKPCode>,
    festzuschuss: number
  ): TreatmentPlan[] {
    const positions = this.generatePositions(befunde, MaterialType.NEM);
    const costs = this.calculateCosts(positions);

    return [{
      name: "Metallkeramische Brücke (Regelversorgung)",
      befunde,
      regelversorgung,
      therapie: regelversorgung,
      description: "Brücke aus Nichtedelmetall (NEM) mit Keramikverblendung",
      estimatedCost: costs.total,
      festzuschuss,
      patientPortion: costs.total - festzuschuss,
      materialType: MaterialType.NEM,
      coverageLevel: CoverageLevel.STANDARD,
      advantages: [
        "Regelversorgung - voller Festzuschuss",
        "Bewährte Standardlösung",
        "Langlebig bei guter Pflege",
      ],
      disadvantages: [
        "Beschleifen der Nachbarzähne notwendig",
        "Metallgerüst kann durchschimmern",
      ],
      maintenanceInterval: 6,
      estimatedLifespan: 15,
      costs,
    }];
  }

  private generateSameTypeOptions(
    befunde: Record<string, HKPCode>,
    regelversorgung: Record<string, HKPCode>,
    festzuschuss: number
  ): TreatmentPlan[] {
    const positions = this.generatePositions(befunde, MaterialType.ZIRCONIA);
    const costs = this.calculateCosts(positions, 2.5); // Higher factor for premium materials

    const therapie = { ...regelversorgung };
    Object.entries(therapie).forEach(([tooth, code]) => {
      if (code === 'K') therapie[tooth] = 'KZ';
      if (code === 'KB') therapie[tooth] = 'KBZ';
      if (code === 'B') therapie[tooth] = 'BZ';
    });

    return [{
      name: "Vollkeramische Brücke (Gleichartig)",
      befunde,
      regelversorgung,
      therapie,
      description: "Vollkeramische Brücke aus Zirkonoxid",
      estimatedCost: costs.total,
      festzuschuss,
      patientPortion: costs.total - festzuschuss,
      materialType: MaterialType.ZIRCONIA,
      coverageLevel: CoverageLevel.SAME_TYPE,
      advantages: [
        "Hochästhetisches Ergebnis",
        "Sehr gute Biokompatibilität",
        "Kein Metallgerüst",
      ],
      disadvantages: [
        "Höhere Kosten",
        "Beschleifen der Nachbarzähne notwendig",
      ],
      maintenanceInterval: 6,
      estimatedLifespan: 15,
      costs,
    }];
  }

  private generateDifferentTypeOptions(
    befunde: Record<string, HKPCode>,
    regelversorgung: Record<string, HKPCode>,
    festzuschuss: number
  ): TreatmentPlan[] {
    const positions = this.generatePositions(befunde, MaterialType.TITANIUM);
    const costs = this.calculateCosts(positions, 2.8); // Highest factor for implants

    const therapie: Record<string, HKPCode> = {};
    Object.entries(befunde).forEach(([tooth, code]) => {
      if (code === 'f') {
        therapie[tooth] = 'IR';
      } else if (regelversorgung[tooth]?.includes('KB')) {
        therapie[tooth] = 'KZ';
      }
    });

    return [{
      name: "Implantatversorgung (Andersartig)",
      befunde,
      regelversorgung,
      therapie,
      description: "Implantate mit vollkeramischen Kronen",
      estimatedCost: costs.total,
      festzuschuss,
      patientPortion: costs.total - festzuschuss,
      materialType: MaterialType.TITANIUM,
      coverageLevel: CoverageLevel.DIFFERENT_TYPE,
      advantages: [
        "Keine Präparation der Nachbarzähne",
        "Fest und natürlich im Gefühl",
        "Beste ästhetische Lösung",
      ],
      disadvantages: [
        "Höchste Kosten",
        "Operativer Eingriff notwendig",
        "Längere Behandlungsdauer",
      ],
      maintenanceInterval: 6,
      estimatedLifespan: 20,
      costs,
    }];
  }
}