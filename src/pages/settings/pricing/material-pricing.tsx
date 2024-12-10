import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useLabPricingStore } from '@/stores/lab-pricing-store';
import { IndicationType } from '@/lib/scanner/types';

export function MaterialPricing() {
  const { config, addMaterial, updateMaterial, deleteMaterial } = useLabPricingStore();
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    typeId: '',
    indication: '' as IndicationType,
    isBaseMaterial: false,
    surchargePercentage: 0,
    notes: '',
  });

  // Filter to only show active material types
  const activeTypes = config.materialTypes.filter(type => type.isActive);

  const handleAdd = () => {
    addMaterial(formData);
    setFormData({
      name: '',
      typeId: '',
      indication: '' as IndicationType,
      isBaseMaterial: false,
      surchargePercentage: 0,
      notes: '',
    });
    setShowDialog(false);
  };

  // Group materials by indication for better organization
  const groupedMaterials = config.materials.reduce((groups, material) => {
    const indication = material.indication;
    if (!groups[indication]) {
      groups[indication] = [];
    }
    groups[indication].push(material);
    return groups;
  }, {} as Record<string, typeof config.materials>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Material Configuration</CardTitle>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Material
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {Object.entries(groupedMaterials).map(([indication, materials]) => (
              <div key={indication} className="space-y-4">
                <h3 className="font-medium text-lg">{indication}</h3>
                <div className="grid gap-4">
                  {materials.map((material) => {
                    const materialType = config.materialTypes.find(
                      (t) => t.id === material.typeId
                    );

                    return (
                      <div
                        key={material.id}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{material.name}</h3>
                            {material.isBaseMaterial && (
                              <Badge variant="secondary">Base Material</Badge>
                            )}
                            {materialType && (
                              <Badge variant="outline">
                                {materialType.name}
                              </Badge>
                            )}
                          </div>
                          {!material.isBaseMaterial && (
                            <p className="text-sm">
                              Surcharge: {material.surchargePercentage}%
                            </p>
                          )}
                          {material.notes && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {material.notes}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMaterial(material.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {config.materials.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No materials configured
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Material</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Material Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Katana UTML"
              />
            </div>

            <div className="space-y-2">
              <Label>Material Type</Label>
              <Select
                value={formData.typeId}
                onValueChange={(value) =>
                  setFormData({ ...formData, typeId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select material type..." />
                </SelectTrigger>
                <SelectContent>
                  {activeTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Indication</Label>
              <Select
                value={formData.indication}
                onValueChange={(value) =>
                  setFormData({ ...formData, indication: value as IndicationType })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select indication..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(IndicationType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isBaseMaterial}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isBaseMaterial: checked })
                }
              />
              <Label>Base Material</Label>
            </div>

            {!formData.isBaseMaterial && (
              <div className="space-y-2">
                <Label>Surcharge Percentage</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="0"
                    value={formData.surchargePercentage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        surchargePercentage: parseFloat(e.target.value),
                      })
                    }
                  />
                  <span className="text-sm text-muted-foreground pt-2">%</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Notes</Label>
              <Input
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Optional notes..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!formData.name || !formData.typeId || !formData.indication}
            >
              Add Material
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}