import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Order } from '@/lib/orders/types';

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