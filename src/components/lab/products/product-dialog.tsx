import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLabProductsStore } from '@/stores/lab-products-store';
import { useAuth } from '@/hooks/use-auth';
import { ProductFeatureList } from './product-feature-list';
import { 
  ProductCategory, 
  MaterialType, 
  ManufacturingType,
  IndicationType 
} from '@/lib/types/product';
import type { Product, ProductFeature } from '@/lib/types/product';

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingId: string | null;
}

export function ProductDialog({ 
  open, 
  onOpenChange,
  editingId 
}: ProductDialogProps) {
  const { user } = useAuth();
  const { products, addProduct, updateProduct } = useLabProductsStore();
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    labId: user?.id || '',
    name: '',
    description: '',
    category: ProductCategory.CROWN,
    indication: IndicationType.CROWN,
    materialType: MaterialType.ZIRCONIA,
    manufacturingType: ManufacturingType.IN_HOUSE,
    manufacturingLocation: 'D-Hamburg',
    features: [],
    basePrice: 0,
    rating: 0,
    reviewCount: 0,
    deliveryDays: 5,
    warranty: {
      years: 5,
      description: '100% satisfaction guarantee',
    },
    isActive: true,
  });

  useEffect(() => {
    if (editingId) {
      const product = products.find(p => p.id === editingId);
      if (product) {
        setFormData(product);
      }
    }
  }, [editingId, products]);

  const handleSubmit = () => {
    if (editingId) {
      updateProduct(editingId, formData);
    } else {
      addProduct(formData);
    }
    onOpenChange(false);
  };

  const updateFeatures = (features: ProductFeature[]) => {
    setFormData(prev => ({ ...prev, features }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {editingId ? 'Edit Product' : 'Add Product'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Premium Zirconia Crown"
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => 
                  setFormData({ ...formData, category: value as ProductCategory })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ProductCategory).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Material Type</Label>
              <Select
                value={formData.materialType}
                onValueChange={(value) =>
                  setFormData({ ...formData, materialType: value as MaterialType })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(MaterialType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Manufacturing Type</Label>
              <Select
                value={formData.manufacturingType}
                onValueChange={(value) =>
                  setFormData({ 
                    ...formData, 
                    manufacturingType: value as ManufacturingType 
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ManufacturingType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Manufacturing Location</Label>
              <Input
                value={formData.manufacturingLocation}
                onChange={(e) => 
                  setFormData({ ...formData, manufacturingLocation: e.target.value })
                }
                placeholder="e.g., D-Hamburg"
              />
            </div>

            <div className="space-y-2">
              <Label>Delivery Days</Label>
              <Input
                type="number"
                min="1"
                value={formData.deliveryDays}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryDays: parseInt(e.target.value) })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Base Price (€)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.basePrice}
                onChange={(e) =>
                  setFormData({ ...formData, basePrice: parseFloat(e.target.value) })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Discount Amount (€)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.discountAmount || ''}
                onChange={(e) =>
                  setFormData({ 
                    ...formData, 
                    discountAmount: e.target.value ? parseFloat(e.target.value) : undefined 
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your product..."
            />
          </div>

          <div className="space-y-2">
            <Label>Warranty</Label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                min="0"
                value={formData.warranty.years}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    warranty: {
                      ...formData.warranty,
                      years: parseInt(e.target.value),
                    },
                  })
                }
                placeholder="Years"
              />
              <Input
                value={formData.warranty.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    warranty: {
                      ...formData.warranty,
                      description: e.target.value,
                    },
                  })
                }
                placeholder="Warranty description"
              />
            </div>
          </div>

          <ProductFeatureList
            features={formData.features}
            onChange={updateFeatures}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {editingId ? 'Save Changes' : 'Add Product'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}