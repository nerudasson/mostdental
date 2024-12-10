import { useTranslation } from 'react-i18next';
import { LabOrdersTable } from '@/components/labs/lab-orders-table';

export function LabOrdersPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('nav.orders')}</h1>
      <LabOrdersTable />
    </div>
  );
}