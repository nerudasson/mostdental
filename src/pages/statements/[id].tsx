import { useParams } from 'react-router-dom';
import { StatementDetail } from '@/components/billing/statement-detail';

export function StatementDetailPage() {
  const { id } = useParams();
  return <StatementDetail statementId={id || ''} />;
}