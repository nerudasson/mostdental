import { useTranslation } from 'react-i18next';
import { InvoiceList } from '@/components/invoices/invoice-list';
import { useAuth } from '@/hooks/use-auth';

export function DentistInvoicesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('nav.invoices')}</h1>
      <InvoiceList dentistId={user.id} />
    </div>
  );
}