import { useTranslation } from 'react-i18next';
import type { TreatmentPlan } from '@/lib/cost-estimation/types';

interface CostBreakdownProps {
  treatmentPlan: TreatmentPlan;
}

export function CostBreakdown({ treatmentPlan }: CostBreakdownProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-8">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          {t('costEstimate.costs.doctorFees')}
        </h3>
        <div className="h-24 bg-muted rounded-lg flex items-center justify-center text-lg">
          €{treatmentPlan.estimatedCost.toFixed(2)}
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          {t('costEstimate.costs.labFees')}
        </h3>
        <div className="h-24 bg-muted rounded-lg flex items-center justify-center text-lg">
          €{(treatmentPlan.estimatedCost * 0.4).toFixed(2)}
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          {t('costEstimate.costs.subsidy')}
        </h3>
        <div className="h-24 bg-muted rounded-lg flex items-center justify-center text-lg">
          €{treatmentPlan.festzuschuss.toFixed(2)}
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          {t('costEstimate.costs.patientPrice')}
        </h3>
        <div className="h-24 bg-primary/10 rounded-lg flex items-center justify-center text-lg font-medium">
          €{treatmentPlan.patientPortion.toFixed(2)}
        </div>
      </div>
    </div>
  );
}