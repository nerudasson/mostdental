import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { OrderDetailPage } from '@/pages/orders/[id]';

export function EstimateDetailPage() {
  const { id } = useParams();
  return <OrderDetailPage />;
}