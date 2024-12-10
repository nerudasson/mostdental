import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MaterialPricing } from './material-pricing';
import { MaterialTypes } from './material-types';
import { BEBPricing } from './beb-pricing';
import { BELPricing } from './bel-pricing';
import { GeneralPricingSettings } from './general-settings';
import { useAuth } from '@/hooks/use-auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function PricingSettingsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');

  if (user?.role !== 'lab') {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Only lab users can access pricing settings.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pricing Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your pricing settings for cost estimates and billing
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="material-types">Material Types</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="beb">BEB Positions</TabsTrigger>
          <TabsTrigger value="bel">BEL Positions</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralPricingSettings />
        </TabsContent>

        <TabsContent value="material-types">
          <MaterialTypes />
        </TabsContent>

        <TabsContent value="materials">
          <MaterialPricing />
        </TabsContent>

        <TabsContent value="beb">
          <BEBPricing />
        </TabsContent>

        <TabsContent value="bel">
          <BELPricing />
        </TabsContent>
      </Tabs>
    </div>
  );
}