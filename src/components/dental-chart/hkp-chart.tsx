import { cn } from '@/lib/utils';
import { HKP_CODES, type HKPCode } from '@/lib/constants';

interface HKPChartProps {
  befunde: Record<string, HKPCode>;
  regelversorgung: Record<string, string>;
  therapie: Record<string, string>;
  className?: string;
}

export function HKPChart({ 
  befunde = {}, 
  regelversorgung = {},
  therapie = {},
  className 
}: HKPChartProps) {
  // Define the quadrants (1-4 for permanent teeth)
  const quadrants = [
    // Upper Row
    {
      left: ['18', '17', '16', '15', '14', '13', '12', '11'],
      right: ['21', '22', '23', '24', '25', '26', '27', '28'],
    },
    // Lower Row
    {
      left: ['48', '47', '46', '45', '44', '43', '42', '41'],
      right: ['31', '32', '33', '34', '35', '36', '37', '38'],
    },
  ];

  const renderToothColumn = (toothId: string, isUpper: boolean) => {
    const baseClasses = "w-10 h-8 text-xs font-medium flex items-center justify-center transition-colors border-r last:border-r-0";
    
    return (
      <div key={toothId} className="flex flex-col border-l first:border-l-0">
        {/* Upper Section */}
        <div className={cn(baseClasses, "bg-green-50 text-green-900")}>
          {therapie[toothId] || ''}
        </div>
        <div className={cn(baseClasses, "bg-gray-50 text-gray-900")}>
          {regelversorgung[toothId] || ''}
        </div>
        <div className={cn(baseClasses, "bg-blue-50 text-blue-900")}>
          {befunde[toothId] || ''}
        </div>
        {/* Tooth Numbers */}
        <div className="w-10 h-6 text-xs font-medium flex items-center justify-center border-y bg-white">
          {toothId}
        </div>
        {/* Lower Section */}
        <div className={cn(baseClasses, "bg-blue-50 text-blue-900")}>
          {befunde[toothId] || ''}
        </div>
        <div className={cn(baseClasses, "bg-gray-50 text-gray-900")}>
          {regelversorgung[toothId] || ''}
        </div>
        <div className={cn(baseClasses, "bg-green-50 text-green-900")}>
          {therapie[toothId] || ''}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col">
        <div className="flex">
          <div className="w-20 flex flex-col border-r">
            <div className="h-8 text-xs font-medium flex items-center px-2 bg-green-50">TP</div>
            <div className="h-8 text-xs font-medium flex items-center px-2 bg-gray-50">R</div>
            <div className="h-8 text-xs font-medium flex items-center px-2 bg-blue-50">B</div>
            <div className="h-6 bg-white border-y" />
            <div className="h-8 text-xs font-medium flex items-center px-2 bg-blue-50">B</div>
            <div className="h-8 text-xs font-medium flex items-center px-2 bg-gray-50">R</div>
            <div className="h-8 text-xs font-medium flex items-center px-2 bg-green-50">TP</div>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-2 border rounded-lg overflow-hidden">
              {/* Upper Jaw */}
              <div className="flex justify-end border-b border-r">
                {quadrants[0].left.map(id => renderToothColumn(id, true))}
              </div>
              <div className="flex justify-start border-b border-l">
                {quadrants[0].right.map(id => renderToothColumn(id, true))}
              </div>
              {/* Lower Jaw */}
              <div className="flex justify-end border-t border-r">
                {quadrants[1].left.map(id => renderToothColumn(id, false))}
              </div>
              <div className="flex justify-start border-t border-l">
                {quadrants[1].right.map(id => renderToothColumn(id, false))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}