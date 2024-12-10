import { useState } from 'react';
import { Plus, X, Grip } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import type { ProductFeature } from '@/lib/types/product';

interface ProductFeatureListProps {
  features: ProductFeature[];
  onChange: (features: ProductFeature[]) => void;
}

export function ProductFeatureList({ features, onChange }: ProductFeatureListProps) {
  const [newFeature, setNewFeature] = useState({
    name: '',
    description: '',
    icon: '',
  });

  const handleAdd = () => {
    if (!newFeature.name) return;

    onChange([
      ...features,
      {
        id: crypto.randomUUID(),
        name: newFeature.name,
        description: newFeature.description,
        icon: newFeature.icon,
        included: true,
      },
    ]);

    setNewFeature({
      name: '',
      description: '',
      icon: '',
    });
  };

  const handleRemove = (id: string) => {
    onChange(features.filter((f) => f.id !== id));
  };

  const handleToggle = (id: string) => {
    onChange(
      features.map((f) =>
        f.id === id ? { ...f, included: !f.included } : f
      )
    );
  };

  return (
    <div className="space-y-4">
      <Label>Features</Label>

      <div className="space-y-4">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className="flex items-start gap-4 p-4 rounded-lg border bg-card"
          >
            <Grip className="h-5 w-5 mt-1 text-muted-foreground cursor-move" />
            <div className="flex-1 space-y-2">
              <Input
                value={feature.name}
                onChange={(e) =>
                  onChange(
                    features.map((f) =>
                      f.id === feature.id ? { ...f, name: e.target.value } : f
                    )
                  )
                }
                placeholder="Feature name"
              />
              <Input
                value={feature.description}
                onChange={(e) =>
                  onChange(
                    features.map((f) =>
                      f.id === feature.id ? { ...f, description: e.target.value } : f
                    )
                  )
                }
                placeholder="Feature description"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={feature.included}
                  onCheckedChange={() => handleToggle(feature.id)}
                />
                <span className="text-sm">
                  {feature.included ? 'Included' : 'Optional'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(feature.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            value={newFeature.name}
            onChange={(e) =>
              setNewFeature({ ...newFeature, name: e.target.value })
            }
            placeholder="New feature name"
          />
        </div>
        <div className="flex-1">
          <Input
            value={newFeature.description}
            onChange={(e) =>
              setNewFeature({ ...newFeature, description: e.target.value })
            }
            placeholder="New feature description"
          />
        </div>
        <Button onClick={handleAdd} disabled={!newFeature.name}>
          <Plus className="h-4 w-4 mr-2" />
          Add Feature
        </Button>
      </div>
    </div>
  );
}