import { useTranslation } from 'react-i18next';

export function OrdersPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-3xl font-bold">{t('nav.orders')}</h1>
    </div>
  );
}