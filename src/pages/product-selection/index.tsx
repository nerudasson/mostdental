import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProductCard } from '@/components/cost-estimate/product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLabProductsStore } from '@/stores/lab-products-store';
import { getProductRequirements } from '@/lib/utils/hkp-mapping';
import { MaterialType, ManufacturingType } from '@/lib/types/product';
import type { Product } from '@/lib/types/product';
import type { HKPCode } from '@/lib/types/hkp';

export function ProductSelectionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state } = location as { state: any };
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    materialTypes: [] as MaterialType[],
    manufacturingTypes: [] as ManufacturingType[],
    manufacturingLocations: [] as string[],
    maxPrice: undefined as number | undefined,
    maxDeliveryDays: undefined as number | undefined,
  });
  const [sortBy, setSortBy] = useState<{field: keyof Product | 'effectivePrice', direction: 'asc' | 'desc'}>({
    field: 'basePrice',
    direction: 'asc'
  });

  const { products } = useLabProductsStore();

  // Get products based on HKP codes
  const getRelevantProducts = () => {
    const befunde = state?.befunde as Record<string, HKPCode>;
    if (!befunde) return [];

    const { categories, suggestedMaterials } = getProductRequirements(befunde);

    return products.filter(product => {
      // Product must match at least one required category
      const matchesCategory = categories.includes(product.category);
      
      // If no material filters are set, prefer suggested materials
      const matchesMaterial = filters.materialTypes.length > 0
        ? filters.materialTypes.includes(product.materialType)
        : suggestedMaterials.includes(product.materialType);

      // Search term matching
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Price and delivery filters
      const matchesPrice = !filters.maxPrice || product.basePrice <= filters.maxPrice;
      const matchesDelivery = !filters.maxDeliveryDays || product.deliveryDays <= filters.maxDeliveryDays;

      return matchesCategory && matchesMaterial && matchesSearch && matchesPrice && matchesDelivery;
    });
  };

  const filteredProducts = getRelevantProducts().filter(product => {
    if (filters.manufacturingTypes.length && !filters.manufacturingTypes.includes(product.manufacturingType)) return false;
    if (filters.manufacturingLocations.length && !filters.manufacturingLocations.includes(product.manufacturingLocation)) return false;
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aValue = sortBy.field === 'effectivePrice' 
      ? (a.basePrice - (a.discountAmount || 0))
      : a[sortBy.field];
    const bValue = sortBy.field === 'effectivePrice'
      ? (b.basePrice - (b.discountAmount || 0))
      : b[sortBy.field];
    
    return sortBy.direction === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const handleCreateEstimate = () => {
    if (!selectedProduct) return;

    toast({
      title: 'Cost estimate created',
      description: 'The estimate has been saved and sent to the lab.',
    });
    navigate('/estimates');
  };

  if (!state?.patient) {
    navigate('/');
    return null;
  }

  const { categories } = getProductRequirements(state.befunde);

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <Label>Material Type</Label>
        <div className="space-y-2 mt-2">
          {Object.values(MaterialType).map((type) => (
            <div key={type} className="flex items-center">
              <input
                type="checkbox"
                id={type}
                checked={filters.materialTypes.includes(type)}
                onChange={(e) => {
                  setFilters(prev => ({
                    ...prev,
                    materialTypes: e.target.checked
                      ? [...prev.materialTypes, type]
                      : prev.materialTypes.filter(t => t !== type)
                  }));
                }}
                className="mr-2"
              />
              <Label htmlFor={type}>{type}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <Label>Manufacturing Type</Label>
        <div className="space-y-2 mt-2">
          {Object.values(ManufacturingType).map((type) => (
            <div key={type} className="flex items-center">
              <input
                type="checkbox"
                id={type}
                checked={filters.manufacturingTypes.includes(type)}
                onChange={(e) => {
                  setFilters(prev => ({
                    ...prev,
                    manufacturingTypes: e.target.checked
                      ? [...prev.manufacturingTypes, type]
                      : prev.manufacturingTypes.filter(t => t !== type)
                  }));
                }}
                className="mr-2"
              />
              <Label htmlFor={type}>{type}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <Label>Maximum Price (€)</Label>
        <Input
          type="number"
          value={filters.maxPrice || ''}
          onChange={(e) => setFilters(prev => ({
            ...prev,
            maxPrice: e.target.value ? Number(e.target.value) : undefined
          }))}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Maximum Delivery Days</Label>
        <Input
          type="number"
          value={filters.maxDeliveryDays || ''}
          onChange={(e) => setFilters(prev => ({
            ...prev,
            maxDeliveryDays: e.target.value ? Number(e.target.value) : undefined
          }))}
          className="mt-2"
        />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Product Selection</h1>
          </div>
          <div className="flex gap-2 mt-2">
            {categories.map(category => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters - Desktop */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-6">
            <FilterSidebar />
          </div>
        </div>

        {/* Filters - Mobile */}
        <div className="lg:hidden mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <ScrollArea className="h-[calc(100vh-4rem)]">
                <FilterSidebar />
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Search and Sort */}
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
            <select
              value={`${sortBy.field}-${sortBy.direction}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-') as [keyof Product | 'effectivePrice', 'asc' | 'desc'];
                setSortBy({ field, direction });
              }}
              className="px-3 py-2 rounded-md border"
            >
              <option value="effectivePrice-asc">Price: Low to High</option>
              <option value="effectivePrice-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="deliveryDays-asc">Fastest Delivery</option>
            </select>
          </div>

          {/* Product List */}
          <div className="space-y-4">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                selected={selectedProduct?.id === product.id}
                onSelect={() => setSelectedProduct(product)}
              />
            ))}

            {sortedProducts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No products found matching your criteria
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t sticky bottom-0 bg-background p-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button 
              onClick={handleCreateEstimate}
              disabled={!selectedProduct}
            >
              Create Estimate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}