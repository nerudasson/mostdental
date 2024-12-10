import { useState } from 'react';
import { Search, Edit2, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useLabProductsStore } from '@/stores/lab-products-store';
import { useAuth } from '@/hooks/use-auth';

interface ProductListProps {
  onEdit: (id: string) => void;
}

export function ProductList({ onEdit }: ProductListProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const { products, toggleProductActive } = useLabProductsStore();

  const filteredProducts = products.filter(product =>
    product.labId === user?.id &&
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{product.name}</h3>
                  <Badge variant="secondary">
                    {product.category}
                  </Badge>
                  {!product.isActive && (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                      Inactive
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {product.description}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span>{product.materialType}</span>
                  <span>•</span>
                  <span>{product.manufacturingLocation}</span>
                  <span>•</span>
                  <span>{product.deliveryDays} days delivery</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleProductActive(product.id)}
                >
                  {product.isActive ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(product.id)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No products found
          </div>
        )}
      </div>
    </div>
  );
}