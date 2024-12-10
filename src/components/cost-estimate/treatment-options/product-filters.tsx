import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';
import { MaterialType, ManufacturingType } from '@/lib/types/product';

interface ProductFilters {
  materialTypes: MaterialType[];
  manufacturingTypes: ManufacturingType[];
  manufacturingLocations: string[];
  maxPrice?: number;
  maxDeliveryDays?: number;
}

interface ProductFiltersProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
}

export function ProductFilters({ filters, onChange }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const activeFilterCount = Object.values(filters).flat().length + 
    (filters.maxPrice ? 1 : 0) + 
    (filters.maxDeliveryDays ? 1 : 0);

  const handleToggleMaterial = (material: MaterialType) => {
    setLocalFilters(prev => ({
      ...prev,
      materialTypes: prev.materialTypes.includes(material)
        ? prev.materialTypes.filter(m => m !== material)
        : [...prev.materialTypes, material]
    }));
  };

  const handleToggleManufacturing = (type: ManufacturingType) => {
    setLocalFilters(prev => ({
      ...prev,
      manufacturingTypes: prev.manufacturingTypes.includes(type)
        ? prev.manufacturingTypes.filter(t => t !== type)
        : [...prev.manufacturingTypes, type]
    }));
  };

  const handleToggleLocation = (location: string) => {
    setLocalFilters(prev => ({
      ...prev,
      manufacturingLocations: prev.manufacturingLocations.includes(location)
        ? prev.manufacturingLocations.filter(l => l !== location)
        : [...prev.manufacturingLocations, location]
    }));
  };

  const handleApply = () => {
    onChange(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const resetFilters = {
      materialTypes: [],
      manufacturingTypes: [],
      manufacturingLocations: [],
    };
    setLocalFilters(resetFilters);
    onChange(resetFilters);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filter
          {activeFilterCount > 0 && (
            <Badge 
              variant="secondary" 
              className="ml-2 bg-primary text-primary-foreground"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Filter Products</SheetTitle>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <X className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Material Type */}
          <div className="space-y-4">
            <Label>Material Type</Label>
            <div className="flex flex-wrap gap-2">
              {Object.values(MaterialType).map((material) => (
                <Badge
                  key={material}
                  variant={localFilters.materialTypes.includes(material) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleToggleMaterial(material)}
                >
                  {material}
                </Badge>
              ))}
            </div>
          </div>

          {/* Manufacturing Type */}
          <div className="space-y-4">
            <Label>Manufacturing Type</Label>
            <div className="flex flex-wrap gap-2">
              {Object.values(ManufacturingType).map((type) => (
                <Badge
                  key={type}
                  variant={localFilters.manufacturingTypes.includes(type) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleToggleManufacturing(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          {/* Manufacturing Location */}
          <div className="space-y-4">
            <Label>Manufacturing Location</Label>
            <div className="flex flex-wrap gap-2">
              {['D-Hamburg', 'D-Berlin', 'China', 'Turkey'].map((location) => (
                <Badge
                  key={location}
                  variant={localFilters.manufacturingLocations.includes(location) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleToggleLocation(location)}
                >
                  {location}
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button className="w-full" onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}