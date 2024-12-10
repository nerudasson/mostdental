import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useOrderStore } from '@/lib/orders/store';
import { useToast } from '@/hooks/use-toast';
import { useNotificationStore } from '@/hooks/use-notifications';
import type { Order } from '@/lib/types/order';

interface PickupConfirmDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const timeSlots = [
  { value: 'morning', label: '9:00 - 12:00' },
  { value: 'afternoon', label: '12:00 - 15:00' },
  { value: 'evening', label: '15:00 - 18:00' },
];

export function PickupConfirmDialog({
  order,
  open,
  onOpenChange,
}: PickupConfirmDialogProps) {
  const { toast } = useToast();
  const { updateOrderStatus } = useOrderStore();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [pickupDate, setPickupDate] = useState<Date | undefined>(
    order.pickupDetails?.preferredDate
  );
  const [timeSlot, setTimeSlot] = useState(
    order.pickupDetails?.preferredTimeSlot || ''
  );
  const [notes, setNotes] = useState(order.pickupDetails?.notes || '');

  const handleConfirm = () => {
    if (!pickupDate || !timeSlot) {
      toast({
        title: 'Missing information',
        description: 'Please select pickup date and time slot',
        variant: 'destructive',
      });
      return;
    }

    // Update order with confirmed pickup details
    updateOrderStatus(order.id, {
      status: order.status,
      pickupDetails: {
        ...order.pickupDetails!,
        preferredDate: pickupDate,
        preferredTimeSlot: timeSlot,
        notes,
        status: 'confirmed',
      },
    });

    // Send notification to dentist
    addNotification({
      type: 'order_message',
      title: 'Pickup Confirmed',
      description: `Pickup scheduled for ${pickupDate.toLocaleDateString()} between ${
        timeSlots.find(slot => slot.value === timeSlot)?.label
      }`,
      orderId: order.id,
    });

    toast({
      title: 'Pickup confirmed',
      description: 'The dentist has been notified of the pickup schedule.',
    });

    onOpenChange(false);
  };

  const handleMarkAsPickedUp = () => {
    updateOrderStatus(order.id, {
      status: order.status,
      pickupDetails: {
        ...order.pickupDetails!,
        status: 'picked_up',
      },
    });

    addNotification({
      type: 'order_message',
      title: 'Impressions Picked Up',
      description: 'Physical impressions have been picked up from the practice.',
      orderId: order.id,
    });

    toast({
      title: 'Pickup completed',
      description: 'The impressions have been marked as picked up.',
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {order.pickupDetails?.status === 'pending'
              ? 'Confirm Pickup'
              : 'Update Pickup'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Pickup Date</Label>
            <Calendar
              mode="single"
              selected={pickupDate}
              onSelect={setPickupDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>

          <div className="space-y-2">
            <Label>Time Slot</Label>
            <Select value={timeSlot} onValueChange={setTimeSlot}>
              <SelectTrigger>
                <SelectValue placeholder="Select time slot..." />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot.value} value={slot.value}>
                    {slot.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about the pickup..."
            />
          </div>
        </div>

        <DialogFooter>
          <div className="flex justify-between w-full">
            {order.pickupDetails?.status === 'confirmed' && (
              <Button
                variant="outline"
                onClick={handleMarkAsPickedUp}
              >
                Mark as Picked Up
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirm}>
                {order.pickupDetails?.status === 'pending'
                  ? 'Confirm Pickup'
                  : 'Update Schedule'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}