import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BillingSettings } from '@/components/settings/billing/billing-settings';
import { XMLSettings } from '@/components/settings/xml-settings';
import { useAuth } from '@/hooks/use-auth';

export function BillingSettingsPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Billing & XML Settings</h1>

      <Tabs defaultValue="billing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="billing">Billing Settings</TabsTrigger>
          <TabsTrigger value="xml">XML Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="billing">
          <BillingSettings />
        </TabsContent>

        <TabsContent value="xml">
          <XMLSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}