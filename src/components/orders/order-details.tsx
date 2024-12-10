import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Truck } from 'lucide-react';
import type { Order } from '@/lib/types/order';

interface OrderDetailsProps {
  order: Order;
}

export function OrderDetails({ order }: OrderDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <span className="text-sm text-muted-foreground">Treatment</span>
          <p className="font-medium">{order.treatment.type}</p>
          <p className="text-sm">{order.treatment.description}</p>
        </div>

        <div>
          <span className="text-sm text-muted-foreground">Due Date</span>
          <p className="font-medium">{format(order.dueDate, 'PPP')}</p>
        </div>

        <div>
          <span className="text-sm text-muted-foreground">Impression Type</span>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">
              {order.impressionType === 'digital_scan' ? 'Digital Scan' : 'Physical Impression'}
            </Badge>
            {order.scannerType && (
              <Badge variant="outline">{order.scannerType}</Badge>
            )}
          </div>
        </div>

        {order.pickupDetails && (
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Pickup Details</span>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {format(order.pickupDetails.preferredDate!, 'PPP')}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {timeSlots.find(slot => slot.value === order.pickupDetails?.preferredTimeSlot)?.label}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Truck className="h-3 w-3" />
                  {order.pickupDetails.status === 'pending' ? 'Pending Pickup' :
                   order.pickupDetails.status === 'confirmed' ? 'Pickup Confirmed' :
                   'Picked Up'}
                </Badge>
              </div>
              {order.pickupDetails.notes && (
                <p className="text-sm mt-2">{order.pickupDetails.notes}</p>
              )}
            </div>
          </div>
        )}

        {order.treatment.notes && (
          <div>
            <span className="text-sm text-muted-foreground">Notes</span>
            <p className="text-sm mt-1">{order.treatment.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}