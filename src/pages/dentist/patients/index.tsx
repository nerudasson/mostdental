import { useTranslation } from 'react-i18next';
import { PatientsTable } from '@/components/patients/patients-table';

export function PatientsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('nav.patients')}</h1>
      <PatientsTable />
    </div>
  );
}