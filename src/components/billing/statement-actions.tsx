import { useState } from 'react';
import { Download, Eye, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatementPreview } from './statement-preview';
import { PaymentButton } from './payment-button';
import { useAuth } from '@/hooks/use-auth';
import type { PaymentStatement } from '@/lib/types/billing';

interface StatementActionsProps {
  statement: PaymentStatement;
  onPaymentSuccess?: () => void;
}

export function StatementActions({ statement, onPaymentSuccess }: StatementActionsProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  return (
    <div className="flex gap-2">
      <StatementPreview statement={statement} />
      
      {user.role === 'dentist' && statement.status === 'pending' && (
        <PaymentButton
          statementId={statement.id}
          amount={statement.totalAmount}
          labAccountId={statement.labId}
          customerId={user.id}
          onSuccess={onPaymentSuccess}
        />
      )}
    </div>
  );
}