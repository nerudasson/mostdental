import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ProductCard } from './product-card';
import { useLabProductsStore } from '@/stores/lab-products-store';
import type { Product } from '@/lib/types/product';

interface ProductListProps {
  category: string;
  onProductSelect: (product: Product) => void;
  selectedProductId?: string;
}

export function ProductList({ 
  category,
  onProductSelect,
  selectedProductId 
}: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const products = useLabProductsStore((state) => 
    state.getProductsByCategory(category)
  );

  const filteredProducts = products.filter(product =>
    product.isActive &&
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
          <ProductCard
            key={product.id}
            product={product}
            selected={product.id === selectedProductId}
            onSelect={() => onProductSelect(product)}
          />
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