import { useState } from 'react';
import { Calendar, Clock, Package2, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useNotificationStore } from '@/hooks/use-notifications';
import { useToast } from '@/hooks/use-toast';
import { generateInvoicePDF } from '@/lib/utils/invoice';
import { addDays } from 'date-fns';

interface LabOrderCompleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any;
}

const timeSlots = [
  { value: '9-12', label: '9:00 - 12:00' },
  { value: '12-15', label: '12:00 - 15:00' },
  { value: '15-18', label: '15:00 - 18:00' },
];

export function LabOrderCompleteDialog({
  open,
  onOpenChange,
  order,
}: LabOrderCompleteDialogProps) {
  const { toast } = useToast();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [generatingInvoice, setGeneratingInvoice] = useState(false);

  const handleComplete = async () => {
    if (!deliveryDate || !timeSlot) return;

    setGeneratingInvoice(true);
    try {
      // Generate invoice
      const invoiceData = {
        invoiceNumber: `INV-${order.id}`,
        date: new Date(),
        dueDate: addDays(new Date(), 30),
        lab: {
          name: 'Best Lab',
          address: 'Lab Street 123\n12345 City\nGermany',
          taxId: 'DE123456789',
          bankDetails: {
            bank: 'Deutsche Bank',
            iban: 'DE89 3704 0044 0532 0130 00',
            bic: 'DEUTDEBBXXX',
          },
        },
        dentist: {
          name: order.dentist.name,
          practice: order.dentist.practice,
          address: order.dentist.address,
        },
        patient: {
          id: order.patient.id,
          name: order.patient.name,
        },
        positions: order.positions,
        notes: notes,
      };

      const invoicePDF = await generateInvoicePDF(invoiceData);
      
      // Create download link
      const url = URL.createObjectURL(invoicePDF);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${order.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Update order status
      order.status = 'completed';

      // Send notifications
      addNotification({
        type: 'order_completed',
        title: 'Order Ready for Pickup',
        description: `Order ${order.id} is ready for pickup on ${deliveryDate.toLocaleDateString()} between ${timeSlots.find(slot => slot.value === timeSlot)?.label}`,
        orderId: order.id,
      });

      addNotification({
        type: 'order_message',
        title: 'Delivery Information',
        description: `Order is ready for pickup.\nDate: ${deliveryDate.toLocaleDateString()}\nTime: ${timeSlots.find(slot => slot.value === timeSlot)?.label}${notes ? `\nNotes: ${notes}` : ''}`,
        orderId: order.id,
      });

      toast({
        title: 'Order marked as complete',
        description: 'The dentist has been notified and invoice has been generated.',
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete order and generate invoice.',
        variant: 'destructive',
      });
    } finally {
      setGeneratingInvoice(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Order {order.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Delivery Date Selection */}
          <div className="space-y-2">
            <Label>Delivery Date</Label>
            <CalendarComponent
              mode="single"
              selected={deliveryDate}
              onSelect={setDeliveryDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>

          {/* Time Slot Selection */}
          <div className="space-y-2">
            <Label>Delivery Time</Label>
            <Select value={timeSlot} onValueChange={setTimeSlot}>
              <SelectTrigger>
                <SelectValue placeholder="Select delivery time..." />
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

          {/* Notes */}
          <div className="space-y-2">
            <Label>Additional Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions for pickup..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleComplete}
            disabled={!deliveryDate || !timeSlot || generatingInvoice}
          >
            {generatingInvoice ? (
              'Generating Invoice...'
            ) : (
              <>
                <Package2 className="h-4 w-4 mr-2" />
                Complete & Generate Invoice
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}