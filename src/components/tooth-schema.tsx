import { useState } from 'react';
import { cn } from '@/lib/utils';
import { HKP_CODES, type HKPCode } from '@/lib/constants';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { Check } from 'lucide-react';

interface ToothSchemaProps {
  selectedTeeth?: string[];
  onToothClick?: (toothId: string) => void;
  readOnly?: boolean;
  className?: string;
  befunde?: Record<string, HKPCode>;
  onBefundChange?: (toothId: string, code: HKPCode) => void;
}

export function ToothSchema({ 
  selectedTeeth = [], 
  onToothClick, 
  readOnly = false, 
  className,
  befunde = {},
  onBefundChange,
}: ToothSchemaProps) {
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  // Define the quadrants (1-4 for permanent teeth)
  const quadrants = [
    // Upper Right (Q1: 18-11)
    ['18', '17', '16', '15', '14', '13', '12', '11'],
    // Upper Left (Q2: 21-28)
    ['21', '22', '23', '24', '25', '26', '27', '28'],
    // Lower Right (Q4: 48-41)
    ['48', '47', '46', '45', '44', '43', '42', '41'],
    // Lower Left (Q3: 31-38)
    ['31', '32', '33', '34', '35', '36', '37', '38'],
  ];

  const getToothColor = (toothId: string) => {
    const id = parseInt(toothId);
    if (id >= 13 && id <= 15 || id >= 23 && id <= 25 || 
        id >= 33 && id <= 35 || id >= 43 && id <= 45) {
      return 'text-pink-500'; // Premolars
    }
    if (id >= 16 && id <= 18 || id >= 26 && id <= 28 || 
        id >= 36 && id <= 38 || id >= 46 && id <= 48) {
      return 'text-blue-500'; // Molars
    }
    if (id === 11 || id === 12 || id === 21 || id === 22 ||
        id === 31 || id === 32 || id === 41 || id === 42) {
      return 'text-amber-500'; // Incisors
    }
    if (id === 13 || id === 23 || id === 33 || id === 43) {
      return 'text-green-500'; // Canines
    }
    return 'text-gray-500';
  };

  const handleBefundSelect = (toothId: string, code: HKPCode) => {
    onBefundChange?.(toothId, code);
    setOpenPopover(null);
  };

  const renderTooth = (toothId: string) => {
    const currentBefund = befunde[toothId];
    const isSelected = selectedTeeth.includes(toothId);

    return (
      <Popover 
        key={toothId} 
        open={openPopover === toothId}
        onOpenChange={(open) => setOpenPopover(open ? toothId : null)}
      >
        <PopoverTrigger asChild>
          <button
            onClick={() => !readOnly && onToothClick?.(toothId)}
            disabled={readOnly}
            className={cn(
              "w-10 h-12 text-xs font-medium rounded-md flex flex-col items-center justify-center transition-colors gap-1 relative",
              isSelected
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80",
              getToothColor(toothId)
            )}
          >
            <span>{toothId}</span>
            {currentBefund && (
              <span className="text-[10px] px-1 bg-secondary rounded">
                {currentBefund}
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-0" align="center">
          <Command>
            <CommandGroup>
              {Object.entries(HKP_CODES).map(([code, description]) => (
                <CommandItem
                  key={code}
                  value={code}
                  onSelect={() => handleBefundSelect(toothId, code as HKPCode)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <span className="font-mono w-8">{code}</span>
                    <span>{description}</span>
                  </div>
                  {currentBefund === code && (
                    <Check className="h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upper Jaw */}
      <div className="grid grid-cols-2 gap-1">
        {/* Upper Right Quadrant */}
        <div className="flex justify-end gap-1">
          {quadrants[0].map((toothId) => renderTooth(toothId))}
        </div>
        {/* Upper Left Quadrant */}
        <div className="flex justify-start gap-1">
          {quadrants[1].map((toothId) => renderTooth(toothId))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed" />

      {/* Lower Jaw */}
      <div className="grid grid-cols-2 gap-1">
        {/* Lower Right Quadrant */}
        <div className="flex justify-end gap-1">
          {quadrants[2].map((toothId) => renderTooth(toothId))}
        </div>
        {/* Lower Left Quadrant */}
        <div className="flex justify-start gap-1">
          {quadrants[3].map((toothId) => renderTooth(toothId))}
        </div>
      </div>
    </div>
  );
}