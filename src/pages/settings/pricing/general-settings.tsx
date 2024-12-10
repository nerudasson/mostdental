import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useLabPricingStore } from '@/stores/lab-pricing-store';
import { useToast } from '@/hooks/use-toast';

export function GeneralPricingSettings() {
  const { toast } = useToast();
  const { config, updateConfig } = useLabPricingStore();

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Your pricing settings have been updated.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Accept Cost Estimates</Label>
              <p className="text-sm text-muted-foreground">
                Automatically accept cost estimates based on your pricing configuration
              </p>
            </div>
            <Switch
              checked={config.autoAcceptEstimates}
              onCheckedChange={(checked) =>
                updateConfig({ autoAcceptEstimates: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>BEL Point Value</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min="0"
                step="0.1"
                value={config.belPointValue}
                onChange={(e) =>
                  updateConfig({ belPointValue: parseFloat(e.target.value) })
                }
              />
              <span className="text-sm text-muted-foreground pt-2">€</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Default Region Factor</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min="0.8"
                max="1.5"
                step="0.1"
                value={config.defaultRegionFactor}
                onChange={(e) =>
                  updateConfig({ defaultRegionFactor: parseFloat(e.target.value) })
                }
              />
              <span className="text-sm text-muted-foreground pt-2">×</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Applied to all positions unless overridden
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}