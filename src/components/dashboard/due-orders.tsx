import { useState } from 'react';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOrderStore } from '@/lib/orders/store';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';

export function DueOrders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orders } = useOrderStore();

  // Filter orders for current dentist and upcoming/overdue
  const dueOrders = orders
    .filter(order => {
      if (order.dentistId !== user?.id) return false;
      if (order.status === 'completed' || order.status === 'cancelled') return false;

      const now = new Date();
      const dueDate = new Date(order.dueDate);
      const twoWeeksFromNow = addDays(now, 14);

      // Show orders due within next 2 weeks or overdue
      return isAfter(dueDate, now) && isBefore(dueDate, twoWeeksFromNow) || 
             isAfter(now, dueDate);
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  if (dueOrders.length === 0) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Clock className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="font-medium mb-2">No Due Orders</h3>
          <p className="text-sm text-muted-foreground max-w-[240px] mx-auto">
            All your orders are on track. You'll see upcoming due dates and overdue orders here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {dueOrders.map((order) => {
        const dueDate = new Date(order.dueDate);
        const isOverdue = isAfter(new Date(), dueDate);

        return (
          <div
            key={order.id}
            className="flex items-center justify-between p-4 rounded-lg border"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{order.patientName}</span>
                <Badge 
                  variant="secondary"
                  className={isOverdue ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {isOverdue ? 'Overdue' : 'Due Soon'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {order.treatment.type} - {order.treatment.description}
              </p>
              <p className="text-sm text-muted-foreground">
                Due {format(dueDate, 'PP')}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              View Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}