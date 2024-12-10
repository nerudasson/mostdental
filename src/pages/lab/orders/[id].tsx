import { useParams } from 'react-router-dom';
import { LabOrderDetail } from '@/components/labs/lab-order-detail';

export function LabOrderDetailPage() {
  const { id } = useParams();
  return <LabOrderDetail orderId={id} />;
}