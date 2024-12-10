import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, View } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { LabPrintoutButton } from './lab-printout-button';
import { useAuth } from '@/hooks/use-auth';
import type { Order } from '@/lib/types/order';

interface OrderHeaderProps {
  order: Order;
  showViewer: boolean;
  onToggleViewer: () => void;
}

export function OrderHeader({
  order,
  showViewer,
  onToggleViewer,
}: OrderHeaderProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{order.patientName}</h1>
          <Badge variant="outline">{order.patientId}</Badge>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground ml-12">
          <span>Order {order.id}</span>
          <span>•</span>
          <span>{format(order.createdAt, 'PPP')}</span>
        </div>
      </div>
      <div className="flex gap-2">
        {user?.role === 'lab' && (
          <LabPrintoutButton order={order} />
        )}
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button 
          variant={showViewer ? "secondary" : "outline"}
          size="sm"
          onClick={onToggleViewer}
        >
          <View className="h-4 w-4 mr-2" />
          {showViewer ? "Hide Model" : "Show Model"}
        </Button>
      </div>
    </div>
  );
}