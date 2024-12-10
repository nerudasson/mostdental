import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: string;
  expYear: string;
  isDefault: boolean;
}

export function PaymentSettingsPage() {
  const { t } = useTranslation();
  const [showAddCard, setShowAddCard] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      brand: 'visa',
      last4: '4242',
      expMonth: '12',
      expYear: '24',
      isDefault: true,
    },
    {
      id: '2',
      brand: 'mastercard',
      last4: '8888',
      expMonth: '08',
      expYear: '25',
      isDefault: false,
    },
  ]);

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleRemoveCard = (id: string) => {
    setPaymentMethods(methods =>
      methods.filter(method => method.id !== id)
    );
  };

  const handleAddCard = () => {
    // Here you would integrate with Stripe or another payment processor
    setShowAddCard(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Payment Methods</h1>
        <Button onClick={() => setShowAddCard(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Saved Payment Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex items-center gap-4">
                <div className="h-8 w-12 rounded border flex items-center justify-center bg-muted">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {method.brand.toUpperCase()} •••• {method.last4}
                  </span>
                  {method.isDefault && (
                    <Badge variant="secondary">Default</Badge>
                  )}
                  <span className="text-sm text-muted-foreground">
                    Expires {method.expMonth}/{method.expYear}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {!method.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(method.id)}
                  >
                    Set as Default
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCard(method.id)}
                  disabled={method.isDefault}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}

          {paymentMethods.length === 0 && (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No payment methods added yet.</p>
              <Button
                variant="link"
                onClick={() => setShowAddCard(true)}
                className="mt-2"
              >
                Add your first payment method
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Add a new credit or debit card to your account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Card Number</Label>
              <Input placeholder="4242 4242 4242 4242" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Expiry Month</Label>
                <Input placeholder="MM" />
              </div>
              <div className="space-y-2">
                <Label>Expiry Year</Label>
                <Input placeholder="YY" />
              </div>
              <div className="space-y-2">
                <Label>CVC</Label>
                <Input placeholder="123" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCard(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCard}>Add Card</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}