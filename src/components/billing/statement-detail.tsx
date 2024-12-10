import { format } from 'date-fns';
import { Download, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBillingStore } from '@/stores/billing-store';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface StatementDetailProps {
  statementId: string;
}

export function StatementDetail({ statementId }: StatementDetailProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const statement = useBillingStore((state) => 
    state.statements.find(s => s.id === statementId)
  );

  if (!statement) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Statement not found
      </div>
    );
  }

  const handleDownload = () => {
    // Implement PDF download
    toast({
      title: 'Download started',
      description: 'Your statement PDF is being generated',
    });
  };

  const handlePayNow = () => {
    // Implement Stripe payment
    toast({
      title: 'Redirecting to payment',
      description: 'You will be redirected to the secure payment page',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold">Statement #{statement.id}</h1>
          <p className="text-sm text-muted-foreground">
            {statement.period 
              ? `Period: ${format(statement.period.startDate, 'PP')} - ${format(statement.period.endDate, 'PP')}`
              : `Created on ${format(statement.createdAt, 'PP')}`
            }
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handleDownload} className="flex-1 sm:flex-none">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          {user?.role === 'dentist' && statement.status === 'pending' && (
            <Button onClick={handlePayNow} className="flex-1 sm:flex-none">
              <ExternalLink className="h-4 w-4 mr-2" />
              Pay Now
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Statement Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant="secondary" className={
                statement.status === 'paid' ? 'bg-green-100 text-green-800' :
                statement.status === 'overdue' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }>
                {statement.status.toUpperCase()}
              </Badge>
            </div>
            {statement.paidAt && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Paid On</span>
                <span>{format(statement.paidAt, 'PP')}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>€{statement.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Processing Fee</span>
                <span>€{(statement.totalAmount * 0.025).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total</span>
                <span>€{(statement.totalAmount * 1.025).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {statement.orders.map((order) => (
              <div key={order.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{order.description}</div>
                    <div className="text-sm text-muted-foreground">
                      Order #{order.id}
                    </div>
                  </div>
                  <div className="font-medium">€{order.amount.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}