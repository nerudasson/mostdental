import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Plus } from 'lucide-react';

export function DentistPaymentSettings() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Payment Methods</h2>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Add your payment methods to easily pay for lab services.
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Billing History</h2>
        <div className="text-sm text-muted-foreground">
          Your payment history will appear here once you start making payments.
        </div>
      </Card>
    </div>
  );
}