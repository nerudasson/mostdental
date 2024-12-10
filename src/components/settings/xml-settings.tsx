import { useState } from 'react';
import { Plus, X, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useXMLSettingsStore } from '@/stores/xml-settings-store';
import { BillingRegion, BILLING_REGION_LABELS } from '@/lib/types/xml-settings';

export function XMLSettings() {
  const { settings, updateSettings, addManufacturingLocation, removeManufacturingLocation, setDefaultManufacturingLocation } = useXMLSettingsStore();
  const [newLocation, setNewLocation] = useState('');

  const handleAddLocation = () => {
    if (!newLocation) return;
    addManufacturingLocation(newLocation);
    setNewLocation('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>XML Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Company Name (XML Firmenname)</Label>
              <Input
                value={settings.companyName}
                onChange={(e) => updateSettings({ companyName: e.target.value })}
                placeholder="Enter company name"
              />
              <p className="text-sm text-muted-foreground">
                This name will appear in the generated XML file
              </p>
            </div>

            <div className="space-y-2">
              <Label>Lab ID (Abrechnungsnummer)</Label>
              <Input
                value={settings.labId}
                onChange={(e) => updateSettings({ labId: e.target.value })}
                placeholder="Enter lab ID"
              />
              <p className="text-sm text-muted-foreground">
                Used for practice identification
              </p>
            </div>

            <div className="space-y-2">
              <Label>Manufacturing Locations (Herstellungsorte)</Label>
              <div className="flex gap-2">
                <Input
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g., D-Hamburg or China"
                />
                <Button onClick={handleAddLocation}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Use "D-" prefix for German locations, country name for foreign locations
              </p>

              <div className="space-y-2 mt-4">
                {settings.manufacturingLocations.map((location) => (
                  <div
                    key={location.id}
                    className="flex items-center justify-between p-2 rounded-lg border"
                  >
                    <div className="flex items-center gap-2">
                      <span>{location.name}</span>
                      {location.isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!location.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDefaultManufacturingLocation(location.id)}
                        >
                          Set as Default
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeManufacturingLocation(location.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Billing Region (Abrechnungsbereich)</Label>
              <Select
                value={settings.billingRegion}
                onValueChange={(value) => 
                  updateSettings({ billingRegion: value as BillingRegion })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(BILLING_REGION_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {key} - {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>NEM Unit Price (XML NEM Preis je Einheit)</Label>
              <Input
                type="number"
                step="0.01"
                value={settings.nemUnitPrice}
                onChange={(e) => 
                  updateSettings({ nemUnitPrice: parseFloat(e.target.value) })
                }
                placeholder="Enter NEM unit price"
              />
            </div>
          </div>

          {(!settings.companyName || !settings.labId || settings.manufacturingLocations.length === 0) && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please complete all required XML settings to ensure proper document generation.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}