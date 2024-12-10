import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { useBillingStore } from '@/stores/billing-store';
import { BillingFrequency, PaymentTiming } from '@/lib/types/billing';
import { createConnectedAccount } from '@/lib/stripe';
import { useToast } from '@/hooks/use-toast';

export function BillingSettings() {
  const { toast } = useToast();
  const { settings, updateSettings } = useBillingStore();
  const [connecting, setConnecting] = useState(false);

  const handleConnectStripe = async () => {
    setConnecting(true);
    try {
      const { accountId, onboardingUrl } = await createConnectedAccount({
        email: 'lab@example.com', // Get from auth context
        businessName: 'Lab Name', // Get from profile
      });

      updateSettings({ stripeAccountId: accountId });

      // Redirect to Stripe onboarding
      window.location.href = onboardingUrl;
    } catch (error) {
      toast({
        title: 'Connection failed',
        description: error instanceof Error ? error.message : 'Failed to connect to Stripe',
        variant: 'destructive',
      });
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!settings.stripeAccountId ? (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Connect your Stripe account to start receiving payments from dentists.
                </AlertDescription>
              </Alert>
              <Button onClick={handleConnectStripe} disabled={connecting}>
                <ExternalLink className="h-4 w-4 mr-2" />
                {connecting ? 'Connecting...' : 'Connect Stripe Account'}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Billing Frequency</Label>
                <Select
                  value={settings.billingFrequency}
                  onValueChange={(value) =>
                    updateSettings({ billingFrequency: value as BillingFrequency })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={BillingFrequency.MONTHLY}>
                      Monthly Statements
                    </SelectItem>
                    <SelectItem value={BillingFrequency.PER_ORDER}>
                      Per Order
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Payment Timing</Label>
                <Select
                  value={settings.paymentTiming}
                  onValueChange={(value) =>
                    updateSettings({ paymentTiming: value as PaymentTiming })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PaymentTiming.IMMEDIATE}>
                      Immediate (5% fee)
                    </SelectItem>
                    <SelectItem value={PaymentTiming.DELAYED}>
                      After Dentist Payment (2.5% fee)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {settings.billingFrequency === BillingFrequency.MONTHLY && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-generate Monthly Statements</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically create statements on a specific day each month
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoGenerateStatements}
                      onCheckedChange={(checked) =>
                        updateSettings({ autoGenerateStatements: checked })
                      }
                    />
                  </div>

                  {settings.autoGenerateStatements && (
                    <div className="space-y-2">
                      <Label>Statement Day of Month</Label>
                      <Input
                        type="number"
                        min="1"
                        max="28"
                        value={settings.statementDayOfMonth}
                        onChange={(e) =>
                          updateSettings({
                            statementDayOfMonth: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Payment Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Send reminders for unpaid statements
                  </p>
                </div>
                <Switch
                  checked={settings.reminderEnabled}
                  onCheckedChange={(checked) =>
                    updateSettings({ reminderEnabled: checked })
                  }
                />
              </div>

              {settings.reminderEnabled && (
                <div className="space-y-2">
                  <Label>Reminder Days Before Due</Label>
                  <Input
                    type="number"
                    min="1"
                    max="30"
                    value={settings.reminderDays}
                    onChange={(e) =>
                      updateSettings({ reminderDays: parseInt(e.target.value) })
                    }
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}