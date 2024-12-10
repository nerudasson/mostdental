import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

interface MaterialPreference {
  id: string;
  category: string;
  materialType: string;
  brand: string;
  notes: string;
  priority: 'primary' | 'secondary' | 'alternative';
}

const categories = [
  { value: 'crown', label: 'Crown (Krone)' },
  { value: 'bridge', label: 'Bridge (Brücke)' },
  { value: 'inlay', label: 'Inlay' },
  { value: 'veneer', label: 'Veneer' },
  { value: 'implant', label: 'Implant (Implantat)' },
];

const materialTypes = {
  crown: [
    { value: 'zirconia', label: 'Zirconia (Zirkonoxid)' },
    { value: 'lithium_disilicate', label: 'Lithium Disilicate (Lithiumdisilikat)' },
    { value: 'pfm', label: 'PFM (VMK)' },
  ],
  bridge: [
    { value: 'zirconia', label: 'Zirconia (Zirkonoxid)' },
    { value: 'pfm', label: 'PFM (VMK)' },
    { value: 'full_metal', label: 'Full Metal (Vollmetall)' },
  ],
  inlay: [
    { value: 'ceramic', label: 'Ceramic (Keramik)' },
    { value: 'gold', label: 'Gold' },
    { value: 'composite', label: 'Composite (Komposit)' },
  ],
  veneer: [
    { value: 'porcelain', label: 'Porcelain (Porzellan)' },
    { value: 'composite', label: 'Composite (Komposit)' },
  ],
  implant: [
    { value: 'titanium', label: 'Titanium (Titan)' },
    { value: 'zirconia', label: 'Zirconia (Zirkonoxid)' },
  ],
};

const brands = {
  zirconia: [
    { value: 'katana', label: 'Katana Zirconia' },
    { value: 'cercon', label: 'Cercon' },
    { value: 'lava', label: '3M Lava' },
    { value: 'prettau', label: 'Prettau' },
  ],
  lithium_disilicate: [
    { value: 'emax', label: 'IPS e.max' },
    { value: 'celtra', label: 'Celtra' },
  ],
  pfm: [
    { value: 'wiron', label: 'Wiron' },
    { value: 'remanium', label: 'Remanium' },
  ],
  ceramic: [
    { value: 'vitablocs', label: 'VITA BLOCS' },
    { value: 'cerecblocs', label: 'CEREC Blocs' },
  ],
};

const priorityStyles = {
  primary: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  secondary: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  alternative: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
};

export function MaterialPreferencesPage() {
  const { t } = useTranslation();
  const [preferences, setPreferences] = useState<MaterialPreference[]>([
    {
      id: '1',
      category: 'crown',
      materialType: 'zirconia',
      brand: 'katana',
      notes: 'Preferred for posterior restorations. High translucency variant for anterior region.',
      priority: 'primary',
    },
    {
      id: '2',
      category: 'bridge',
      materialType: 'zirconia',
      brand: 'prettau',
      notes: 'Good for long-span bridges. Please ensure adequate connector dimensions.',
      priority: 'primary',
    },
  ]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    materialType: '',
    brand: '',
    notes: '',
    priority: 'primary' as const,
  });

  const handleAdd = () => {
    if (editingId) {
      setPreferences(preferences.map(pref => 
        pref.id === editingId 
          ? { ...formData, id: pref.id }
          : pref
      ));
      setEditingId(null);
    } else {
      setPreferences([
        ...preferences,
        {
          ...formData,
          id: Math.random().toString(36).substr(2, 9),
        },
      ]);
    }
    setFormData({
      category: '',
      materialType: '',
      brand: '',
      notes: '',
      priority: 'primary',
    });
    setShowDialog(false);
  };

  const handleEdit = (preference: MaterialPreference) => {
    setFormData({
      category: preference.category,
      materialType: preference.materialType,
      brand: preference.brand,
      notes: preference.notes,
      priority: preference.priority,
    });
    setEditingId(preference.id);
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    setPreferences(preferences.filter(pref => pref.id !== id));
  };

  const getAvailableMaterials = (category: string) => {
    return materialTypes[category as keyof typeof materialTypes] || [];
  };

  const getAvailableBrands = (materialType: string) => {
    return brands[materialType as keyof typeof brands] || [];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Material Preferences</h1>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Preference
        </Button>
      </div>

      <div className="grid gap-4">
        {categories.map((category) => {
          const categoryPreferences = preferences.filter(
            (pref) => pref.category === category.value
          );

          if (categoryPreferences.length === 0) return null;

          return (
            <Card key={category.value}>
              <CardHeader>
                <CardTitle>{category.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryPreferences.map((preference) => (
                  <div
                    key={preference.id}
                    className="flex items-start justify-between p-4 rounded-lg border"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">
                          {getAvailableMaterials(preference.category).find(
                            (m) => m.value === preference.materialType
                          )?.label}
                        </h3>
                        <Badge variant="secondary" className={priorityStyles[preference.priority]}>
                          {preference.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Brand: {getAvailableBrands(preference.materialType).find(
                          (b) => b.value === preference.brand
                        )?.label}
                      </p>
                      {preference.notes && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {preference.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(preference)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(preference.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}

        {preferences.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-32">
              <p className="text-muted-foreground text-sm">
                No material preferences added yet.
              </p>
              <Button
                variant="link"
                className="mt-2"
                onClick={() => setShowDialog(true)}
              >
                Add your first preference
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {editingId ? 'Edit Material Preference' : 'Add Material Preference'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Define your preferred materials for different types of dental work.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  setFormData({
                    ...formData,
                    category: value,
                    materialType: '',
                    brand: '',
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.category && (
              <div className="space-y-2">
                <Label>Material Type</Label>
                <Select
                  value={formData.materialType}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      materialType: value,
                      brand: '',
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select material type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableMaterials(formData.category).map((material) => (
                      <SelectItem key={material.value} value={material.value}>
                        {material.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.materialType && brands[formData.materialType as keyof typeof brands] && (
              <div className="space-y-2">
                <Label>Brand</Label>
                <Select
                  value={formData.brand}
                  onValueChange={(value) => 
                    setFormData({ ...formData, brand: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableBrands(formData.materialType).map((brand) => (
                      <SelectItem key={brand.value} value={brand.value}>
                        {brand.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: 'primary' | 'secondary' | 'alternative') =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary Choice</SelectItem>
                  <SelectItem value="secondary">Secondary Choice</SelectItem>
                  <SelectItem value="alternative">Alternative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any specific requirements or preferences..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAdd}
              disabled={!formData.category || !formData.materialType}
            >
              {editingId ? 'Save Changes' : 'Add Preference'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}