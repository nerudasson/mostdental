import { useState } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/cost-estimate/product-card';
import { ProductFilters } from './product-filters';
import { ProductSort } from './product-sort';
import { useLabProductsStore } from '@/stores/lab-products-store';
import type { Product } from '@/lib/types/product';
import type { MaterialType, ManufacturingType } from '@/lib/types/product';

interface ProductSelectionProps {
  category: string;
  selectedProductId?: string;
  onProductSelect: (product: Product) => void;
}

export type SortOption = {
  value: keyof Product | 'effectivePrice';
  label: string;
  direction: 'asc' | 'desc';
};

export function ProductSelection({
  category,
  selectedProductId,
  onProductSelect,
}: ProductSelectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>({
    value: 'basePrice',
    label: 'Price',
    direction: 'asc'
  });
  const [filters, setFilters] = useState({
    materialTypes: [] as MaterialType[],
    manufacturingTypes: [] as ManufacturingType[],
    manufacturingLocations: [] as string[],
  });

  const products = useLabProductsStore((state) => 
    state.getProductsByCategory(category)
  );

  const filteredProducts = products.filter(product =>
    // Active products only
    product.isActive &&
    // Search term
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    // Material type filter
    (filters.materialTypes.length === 0 ||
     filters.materialTypes.includes(product.materialType)) &&
    // Manufacturing type filter
    (filters.manufacturingTypes.length === 0 ||
     filters.manufacturingTypes.includes(product.manufacturingType)) &&
    // Manufacturing location filter
    (filters.manufacturingLocations.length === 0 ||
     filters.manufacturingLocations.includes(product.manufacturingLocation))
  );

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy.value === 'effectivePrice') {
      const aPrice = a.discountAmount ? a.basePrice - a.discountAmount : a.basePrice;
      const bPrice = b.discountAmount ? b.basePrice - b.discountAmount : b.basePrice;
      return sortBy.direction === 'asc' ? aPrice - bPrice : bPrice - aPrice;
    }

    if (typeof a[sortBy.value] === 'number' && typeof b[sortBy.value] === 'number') {
      return sortBy.direction === 'asc' 
        ? (a[sortBy.value] as number) - (b[sortBy.value] as number)
        : (b[sortBy.value] as number) - (a[sortBy.value] as number);
    }

    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <ProductSort
            value={sortBy}
            onChange={setSortBy}
          />
          <ProductFilters
            filters={filters}
            onChange={setFilters}
          />
        </div>
      </div>

      <div className="space-y-4">
        {sortedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            selected={product.id === selectedProductId}
            onSelect={() => onProductSelect(product)}
          />
        ))}

        {sortedProducts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No products found
          </div>
        )}
      </div>
    </div>
  );
}