import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';
import type { SortOption } from './product-selection';

interface ProductSortProps {
  value: SortOption;
  onChange: (option: SortOption) => void;
}

const sortOptions: SortOption[] = [
  { value: 'effectivePrice', label: 'Price (Low to High)', direction: 'asc' },
  { value: 'effectivePrice', label: 'Price (High to Low)', direction: 'desc' },
  { value: 'rating', label: 'Rating (High to Low)', direction: 'desc' },
  { value: 'rating', label: 'Rating (Low to High)', direction: 'asc' },
  { value: 'deliveryDays', label: 'Delivery Time (Fast to Slow)', direction: 'asc' },
  { value: 'deliveryDays', label: 'Delivery Time (Slow to Fast)', direction: 'desc' },
  { value: 'reviewCount', label: 'Most Reviewed', direction: 'desc' },
];

export function ProductSort({ value, onChange }: ProductSortProps) {
  const currentOption = sortOptions.find(
    option => option.value === value.value && option.direction === value.direction
  );

  return (
    <Select
      value={`${currentOption?.value}-${currentOption?.direction}`}
      onValueChange={(val) => {
        const [value, direction] = val.split('-') as [keyof Product | 'effectivePrice', 'asc' | 'desc'];
        const option = sortOptions.find(
          opt => opt.value === value && opt.direction === direction
        );
        if (option) {
          onChange(option);
        }
      }}
    >
      <SelectTrigger className="w-[200px]">
        <ArrowUpDown className="h-4 w-4 mr-2" />
        <SelectValue placeholder="Sort by..." />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem 
            key={`${option.value}-${option.direction}`}
            value={`${option.value}-${option.direction}`}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}