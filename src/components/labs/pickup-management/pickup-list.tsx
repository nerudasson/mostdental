import { useState } from 'react';
import { format } from 'date-fns';
import { Search, Calendar, Clock, Truck, CheckCircle } from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useOrderStore } from '@/lib/orders/store';

const timeSlots = [
  { value: 'morning', label: '9:00 - 12:00' },
  { value: 'afternoon', label: '12:00 - 15:00' },
  { value: 'evening', label: '15:00 - 18:00' },
];

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  picked_up: 'bg-green-100 text-green-800',
};

export function PickupList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { orders } = useOrderStore();

  // Filter orders with physical impressions
  const pickupOrders = orders.filter(order => 
    order.impressionType === 'physical' && 
    order.pickupDetails &&
    (order.pickupDetails.status === 'pending' || order.pickupDetails.status === 'confirmed') &&
    (order.dentistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.practice.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.patientId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Mobile card view
  const renderMobileCard = (order: Order) => {
    const pickupDetails = order.pickupDetails!;
    const timeSlot = timeSlots.find(slot => slot.value === pickupDetails.preferredTimeSlot);

    return (
      <Card key={order.id} className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium">{order.practice}</div>
            <div className="text-sm text-muted-foreground">{order.dentistName}</div>
          </div>
          <Badge 
            variant="secondary" 
            className={statusStyles[pickupDetails.status]}
          >
            {pickupDetails.status === 'pending' ? (
              <>
                <Truck className="h-3 w-3 mr-1" />
                Pending
              </>
            ) : (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Confirmed
              </>
            )}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Patient ID</div>
            <div>{order.patientId}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Pickup Date</div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              {format(pickupDetails.preferredDate!, 'PP')}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Time Slot</div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              {timeSlot?.label}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedOrder(order)}
            disabled={pickupDetails.status === 'picked_up'}
          >
            {pickupDetails.status === 'pending' ? 'Confirm' : 'Update'}
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pickups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Practice</TableHead>
              <TableHead>Patient ID</TableHead>
              <TableHead>Preferred Date</TableHead>
              <TableHead>Time Slot</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pickupOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.practice}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.dentistName}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{order.patientId}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {format(order.pickupDetails!.preferredDate!, 'PP')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {timeSlots.find(slot => 
                      slot.value === order.pickupDetails?.preferredTimeSlot
                    )?.label}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className={statusStyles[order.pickupDetails!.status]}
                  >
                    {order.pickupDetails!.status === 'pending' && (
                      <>
                        <Truck className="h-3 w-3 mr-1" />
                        Pending
                      </>
                    )}
                    {order.pickupDetails!.status === 'confirmed' && (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Confirmed
                      </>
                    )}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                    disabled={order.pickupDetails!.status === 'picked_up'}
                  >
                    {order.pickupDetails!.status === 'pending' ? 'Confirm' : 'Update'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {pickupOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">No pickups scheduled</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {pickupOrders.map(renderMobileCard)}
        {pickupOrders.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No pickups scheduled
          </div>
        )}
      </div>

      {selectedOrder && (
        <PickupConfirmDialog
          order={selectedOrder}
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}