import { useTranslation } from 'react-i18next';
import { PickupList } from '@/components/labs/pickup-management/pickup-list';

export function LabPickupsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pickup Management</h1>
      <PickupList />
    </div>
  );
}