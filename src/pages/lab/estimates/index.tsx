import { useTranslation } from 'react-i18next';
import { LabCostEstimatesTable } from '@/components/labs/lab-cost-estimates-table';

export function LabEstimatesPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('nav.estimates')}</h1>
      <LabCostEstimatesTable />
    </div>
  );
}