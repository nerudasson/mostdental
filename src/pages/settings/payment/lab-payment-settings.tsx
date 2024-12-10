import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, ExternalLink } from 'lucide-react';

export function LabPaymentSettings() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Payment Setup</h2>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Connect your payment account to receive payments from dentists.
          </p>
          <Button>
            <CreditCard className="h-4 w-4 mr-2" />
            Setup Payment Account
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Payment History</h2>
        <div className="text-sm text-muted-foreground">
          Your payment history will appear here once you start receiving payments.
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Payout Schedule</h2>
        <div className="text-sm text-muted-foreground">
          Complete your payment account setup to receive automatic payouts.
        </div>
      </Card>
    </div>
  );
}