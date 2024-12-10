import { useState } from 'react';
import { 
  InsuranceType, 
  CoverageLevel, 
  TreatmentPlan,
  MaterialType 
} from '@/lib/cost-estimation/types';
import { CostEstimationCalculator } from '@/lib/cost-estimation/calculator';
import { LabPriceCalculator } from '@/lib/pricing/calculator';
import type { HKPCode } from '@/lib/types/hkp';
import { useCostEstimateStore } from '@/stores/cost-estimates';
import { useLabPricingStore } from '@/stores/lab-pricing-store';
import { useToast } from '@/hooks/use-toast';

interface UseCostEstimationProps {
  initialBefunde?: Record<string, HKPCode>;
  insuranceType?: InsuranceType;
  bonusYears?: number;
  hasAdditionalInsurance?: boolean;
  patientId?: string;
  patientName?: string;
  selectedLab?: string;
}

export function useCostEstimation({
  initialBefunde = {},
  insuranceType = InsuranceType.PUBLIC,
  bonusYears = 0,
  hasAdditionalInsurance = false,
  patientId,
  patientName,
  selectedLab,
}: UseCostEstimationProps = {}) {
  const { toast } = useToast();
  const { addEstimate } = useCostEstimateStore();
  const { config: labConfig } = useLabPricingStore();
  const [befunde, setBefunde] = useState<Record<string, HKPCode>>(initialBefunde);
  const [treatmentOptions, setTreatmentOptions] = useState<Record<CoverageLevel, TreatmentPlan[]>>();
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>(MaterialType.NEM);
  const [gozFactor, setGozFactor] = useState(2.3);

  const calculator = new CostEstimationCalculator();
  const labCalculator = new LabPriceCalculator(labConfig);

  const calculateOptions = () => {
    try {
      // Calculate base treatment options
      const options = calculator.calculateTreatmentOptions(
        befunde,
        insuranceType,
        bonusYears,
        hasAdditionalInsurance
      );

      // Calculate lab costs for each option
      Object.entries(options).forEach(([level, plans]) => {
        plans.forEach(plan => {
          const labCosts = labCalculator.calculateCosts({
            befunde,
            insuranceType,
            coverageLevel: level as CoverageLevel,
            indication: plan.name,
            materialType: plan.materialType,
          });

          // Add lab costs to plan
          plan.costs.materialCosts = labCosts.materials.map(m => [
            m.name,
            m.finalPrice,
            m.quantity
          ]);
          plan.estimatedCost += labCosts.total;
          plan.patientPortion += labCosts.total;
        });
      });

      setTreatmentOptions(options);

      // Create cost estimate entry if patient info is provided
      if (patientId && patientName && selectedLab) {
        const standardOption = options[CoverageLevel.STANDARD][0];
        addEstimate({
          id: crypto.randomUUID(),
          dentist: {
            id: 'current-dentist-id',
            name: 'Dr. Smith',
            practice: 'Smith Dental',
            email: 'dr.smith@example.com',
          },
          patient: {
            id: patientId,
            name: patientName,
          },
          treatment: {
            type: standardOption.name,
            description: standardOption.description,
            teeth: Object.keys(befunde),
            befunde,
            regelversorgung: standardOption.regelversorgung,
            therapie: standardOption.therapie,
          },
          lab: selectedLab ? {
            id: selectedLab,
            name: 'Selected Lab Name',
          } : undefined,
          status: labConfig.autoAcceptEstimates ? 'priced' : 'pending_lab',
          totalCost: standardOption.estimatedCost,
          labFees: standardOption.costs.materialCosts.reduce((sum, [_, price, qty]) => sum + price * qty, 0),
          festzuschuss: standardOption.festzuschuss,
          patientPortion: standardOption.patientPortion,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        toast({
          title: 'Cost estimate created',
          description: 'The estimate has been saved and can be sent to the lab.',
        });
      }

      return options;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to calculate treatment options',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateBefund = (toothNumber: string, code: HKPCode) => {
    setBefunde(prev => ({
      ...prev,
      [toothNumber]: code
    }));
  };

  const updateGozFactor = (factor: number) => {
    setGozFactor(factor);
    if (treatmentOptions) {
      calculateOptions();
    }
  };

  const selectMaterial = (material: MaterialType) => {
    setSelectedMaterial(material);
    if (treatmentOptions) {
      calculateOptions();
    }
  };

  const clearBefunde = () => {
    setBefunde({});
    setTreatmentOptions(undefined);
  };

  return {
    befunde,
    treatmentOptions,
    gozFactor,
    selectedLab,
    selectedMaterial,
    updateBefund,
    calculateOptions,
    clearBefunde,
    updateGozFactor,
    selectMaterial,
  };
}