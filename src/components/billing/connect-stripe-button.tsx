import { useState } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createConnectedAccount } from '@/lib/stripe';

interface ConnectStripeButtonProps {
  email: string;
  businessName: string;
  onSuccess?: (accountId: string) => void;
  onError?: (error: Error) => void;
}

export function ConnectStripeButton({
  email,
  businessName,
  onSuccess,
  onError,
}: ConnectStripeButtonProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const { accountId, onboardingUrl } = await createConnectedAccount({
        email,
        businessName,
      });

      onSuccess?.(accountId);
      
      // Redirect to Stripe onboarding
      window.location.href = onboardingUrl;
    } catch (error) {
      console.error('Stripe connection error:', error);
      toast({
        title: 'Connection failed',
        description: error instanceof Error ? error.message : 'Failed to connect to Stripe',
        variant: 'destructive',
      });
      onError?.(error instanceof Error ? error : new Error('Connection failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleConnect} disabled={loading}>
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <ExternalLink className="h-4 w-4 mr-2" />
      )}
      {loading ? 'Connecting...' : 'Connect Stripe Account'}
    </Button>
  );
}