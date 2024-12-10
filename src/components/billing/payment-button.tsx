import { useState } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createPaymentSession, handlePayment } from '@/lib/stripe/client';

interface PaymentButtonProps {
  statementId: string;
  amount: number;
  labAccountId: string;
  customerId?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function PaymentButton({
  statementId,
  amount,
  labAccountId,
  customerId,
  onSuccess,
  onError,
}: PaymentButtonProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const sessionId = await createPaymentSession({
        statementId,
        amount,
        labAccountId,
        customerId,
      });

      await handlePayment(sessionId);
      onSuccess?.();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment failed',
        description: error instanceof Error ? error.message : 'Failed to process payment',
        variant: 'destructive',
      });
      onError?.(error instanceof Error ? error : new Error('Payment failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={loading}>
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <ExternalLink className="h-4 w-4 mr-2" />
      )}
      {loading ? 'Processing...' : 'Pay Now'}
    </Button>
  );
}