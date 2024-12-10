import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, View, Package2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import type { Order } from '@/lib/types/order';

interface OrderHeaderProps {
  order: Order;
  showViewer: boolean;
  onToggleViewer: () => void;
  onCheckIn?: () => void;
  onComplete?: () => void;
}

export function OrderHeader({
  order,
  showViewer,
  onToggleViewer,
  onCheckIn,
  onComplete,
}: OrderHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{order.patientName}</h1>
            <Badge variant="outline">{order.patientId}</Badge>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Printer className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Print</span>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button 
            variant={showViewer ? "secondary" : "outline"}
            size="sm"
            onClick={onToggleViewer}
            className="flex-1 sm:flex-none"
          >
            <View className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">
              {showViewer ? "Hide Model" : "Show Model"}
            </span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-muted-foreground">
        <span>Order {order.id}</span>
        <span className="hidden sm:inline">•</span>
        <span>{format(order.createdAt, 'PPP')}</span>
        <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
          {onCheckIn && (
            <Button onClick={onCheckIn} className="flex-1 sm:flex-none">
              Check-in Case
            </Button>
          )}
          {onComplete && (
            <Button onClick={onComplete} className="flex-1 sm:flex-none">
              <Package2 className="h-4 w-4 mr-2" />
              Complete Order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}