import { useTranslation } from 'react-i18next';
import { HonorarDetails } from './honorar-details';
import { LabSelection } from './lab-selection';
import { InsuranceCheck } from './insurance-check';
import type { TreatmentPlan } from '@/lib/cost-estimation/types';

interface DetailPanelProps {
  selectedDetail: 'honorar' | 'labor' | 'patient' | null;
  treatmentPlan: TreatmentPlan;
  gozFactor: number;
  onGozFactorChange: (factor: number) => void;
  onLabSelect: (labId: string) => void;
}

export function DetailPanel({
  selectedDetail,
  treatmentPlan,
  gozFactor,
  onGozFactorChange,
  onLabSelect,
}: DetailPanelProps) {
  if (!selectedDetail) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Wählen Sie einen Bereich aus der Kostenberechnung aus
      </div>
    );
  }

  return (
    <div className="p-6">
      {selectedDetail === 'honorar' && (
        <HonorarDetails
          treatmentPlan={treatmentPlan}
          gozFactor={gozFactor}
          onGozFactorChange={onGozFactorChange}
        />
      )}
      
      {selectedDetail === 'labor' && (
        <LabSelection
          selectedLab={null}
          onLabSelect={onLabSelect}
        />
      )}
      
      {selectedDetail === 'patient' && (
        <InsuranceCheck
          patientCosts={treatmentPlan.patientPortion}
        />
      )}
    </div>
  );
}