import { useTranslation } from 'react-i18next';
import { CostEstimatesTable } from '@/components/cost-estimate/cost-estimates-table';

export function EstimatesPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('nav.estimates')}</h1>
      <CostEstimatesTable />
    </div>
  );
}