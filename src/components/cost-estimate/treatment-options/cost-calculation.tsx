import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import type { TreatmentPlan } from '@/lib/cost-estimation/types';

interface CostCalculationProps {
  treatmentPlan: TreatmentPlan;
  onDetailSelect: (detail: 'honorar' | 'labor' | 'patient' | null) => void;
  selectedDetail: 'honorar' | 'labor' | 'patient' | null;
}

export function CostCalculation({
  treatmentPlan,
  onDetailSelect,
  selectedDetail,
}: CostCalculationProps) {
  const { t } = useTranslation();

  const items = [
    {
      id: 'honorar',
      label: 'Honorar',
      value: treatmentPlan.costs.totalGoz + treatmentPlan.costs.totalBema,
      valueDisplay: `ca. ${(treatmentPlan.costs.totalGoz + treatmentPlan.costs.totalBema).toFixed(0)}€`,
      operator: null,
    },
    {
      id: 'labor',
      label: 'Labor',
      value: treatmentPlan.costs.materialCosts.reduce((sum, [_, price, qty]) => sum + price * qty, 0),
      valueDisplay: `${treatmentPlan.costs.materialCosts.reduce((sum, [_, price, qty]) => sum + price * qty, 0).toFixed(0)}-${(treatmentPlan.costs.materialCosts.reduce((sum, [_, price, qty]) => sum + price * qty, 0) + 200).toFixed(0)}€`,
      operator: '+',
    },
    {
      id: 'gesamt',
      label: 'Gesamt',
      value: treatmentPlan.estimatedCost,
      valueDisplay: `${treatmentPlan.estimatedCost.toFixed(0)}-${(treatmentPlan.estimatedCost + 200).toFixed(0)}€`,
      operator: null,
    },
    {
      id: 'festzuschuss',
      label: 'Festzuschuss',
      value: treatmentPlan.festzuschuss,
      valueDisplay: `ca. ${treatmentPlan.festzuschuss.toFixed(0)}€`,
      operator: '-',
    },
    {
      id: 'patient',
      label: 'Patientenanteil',
      value: treatmentPlan.patientPortion,
      valueDisplay: `ca. ${treatmentPlan.patientPortion.toFixed(0)}€`,
      operator: null,
      highlight: true,
    },
  ];

  return (
    <div className="p-6 border-r h-full overflow-auto">
      <h3 className="font-semibold mb-6">Kostenberechnung</h3>
      
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="relative">
            {item.operator && (
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 text-xl font-medium text-muted-foreground">
                {item.operator}
              </div>
            )}
            {index === 2 && (
              <div className="border-t border-dashed my-4" />
            )}
            {index === 4 && (
              <div className="border-t border-dashed my-4" />
            )}
            <button
              onClick={() => item.id !== 'gesamt' && onDetailSelect(item.id as 'honorar' | 'labor' | 'patient')}
              disabled={item.id === 'gesamt'}
              className={`w-full text-left p-4 rounded-lg transition-colors ${
                item.id === 'gesamt' 
                  ? 'bg-muted cursor-default'
                  : selectedDetail === item.id
                  ? 'bg-primary/10 border-primary'
                  : 'bg-muted/50 hover:bg-muted'
              } ${item.highlight ? 'border-2 bg-primary/5' : 'border'}`}
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">{item.label}</div>
                <div className="flex items-center gap-2">
                  <span className={`${item.highlight ? 'text-lg font-semibold' : ''}`}>
                    {item.valueDisplay}
                  </span>
                  {item.id !== 'gesamt' && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}