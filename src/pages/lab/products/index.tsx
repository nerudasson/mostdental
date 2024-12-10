import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductList } from '@/components/lab/products/product-list';
import { ProductDialog } from '@/components/lab/products/product-dialog';
import { useAuth } from '@/hooks/use-auth';

export function LabProductsPage() {
  const { user } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowDialog(true);
  };

  const handleClose = () => {
    setShowDialog(false);
    setEditingId(null);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog and pricing
          </p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <ProductList onEdit={handleEdit} />

      <ProductDialog
        open={showDialog}
        onOpenChange={handleClose}
        editingId={editingId}
      />
    </div>
  );
}