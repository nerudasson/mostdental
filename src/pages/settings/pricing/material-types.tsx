import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useLabPricingStore } from '@/stores/lab-pricing-store';

const materialCategories = [
  { value: 'metal', label: 'Metal' },
  { value: 'ceramic', label: 'Ceramic' },
  { value: 'polymer', label: 'Polymer' },
  { value: 'composite', label: 'Composite' },
];

export function MaterialTypes() {
  const { config, addMaterialType, updateMaterialType, deleteMaterialType } = useLabPricingStore();
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    category: '',
    isActive: true,
  });

  const handleAdd = () => {
    addMaterialType(formData);
    setFormData({
      name: '',
      code: '',
      description: '',
      category: '',
      isActive: true,
    });
    setShowDialog(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Material Types</CardTitle>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Material Type
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {config.materialTypes.map((type) => (
              <div
                key={type.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{type.name}</h3>
                    <Badge variant="secondary">{type.code}</Badge>
                    {!type.isActive && (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {materialCategories.find((c) => c.value === type.category)?.label}
                  </p>
                  {type.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {type.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={type.isActive}
                    onCheckedChange={(checked) =>
                      updateMaterialType(type.id, { isActive: checked })
                    }
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMaterialType(type.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {config.materialTypes.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No material types configured
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Material Type</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Zirconia HT"
              />
            </div>

            <div className="space-y-2">
              <Label>Code</Label>
              <Input
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="e.g., ZR-HT"
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              >
                <option value="">Select category...</option>
                {materialCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Optional description..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!formData.name || !formData.code || !formData.category}
            >
              Add Material Type
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}