import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { useOrderStore } from '@/lib/orders/store';
import { useAppointmentSchedules } from '@/stores/appointment-schedules';
import { AppointmentSchedulePreview } from '@/components/orders/appointment-schedule-preview';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Order } from '@/lib/orders/types';

interface LabOrderCheckInDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LabOrderCheckInDialog({
  order,
  open,
  onOpenChange,
}: LabOrderCheckInDialogProps) {
  const { toast } = useToast();
  const { updateOrderStatus } = useOrderStore();
  const { schedules, getSchedulesByIndication, scheduleAppointments } = useAppointmentSchedules();
  
  const [action, setAction] = useState<'accept' | 'reject' | null>(null);
  const [completionDate, setCompletionDate] = useState<Date>();
  const [notes, setNotes] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<string>('');

  // Get available schedules for this order's indication
  const availableSchedules = getSchedulesByIndication(order.treatment.type);
  const defaultSchedule = availableSchedules.find(s => s.isDefault);

  // Set default schedule when dialog opens
  useState(() => {
    if (defaultSchedule) {
      setSelectedSchedule(defaultSchedule.id);
    }
  }, [defaultSchedule]);

  const handleSubmit = async () => {
    if (action === 'accept' && (!completionDate || !selectedSchedule)) {
      toast({
        title: 'Missing information',
        description: 'Please select completion date and appointment schedule',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateOrderStatus(order.id, {
        status: action === 'accept' ? 'in_progress' : 'rejected',
        checkin: {
          orderId: order.id,
          checkedInAt: new Date(),
          checkedInBy: 'Lab User', // In real app, get from auth context
          estimatedCompletionDate: completionDate!,
          notes,
          rejectionReason: action === 'reject' ? notes : undefined,
        },
      });

      // Schedule appointments if accepting order
      if (action === 'accept' && selectedSchedule) {
        scheduleAppointments(order.id, selectedSchedule, new Date());
      }

      toast({
        title: action === 'accept' ? 'Order accepted' : 'Order rejected',
        description: action === 'accept' 
          ? 'The order has been accepted and moved to production'
          : 'The order has been rejected',
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process order check-in',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {action === 'accept' ? 'Accept Order' : 
             action === 'reject' ? 'Reject Order' : 
             'Order Check-in'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!action ? (
            <div className="flex gap-4">
              <Button 
                className="flex-1" 
                onClick={() => setAction('accept')}
              >
                Accept Order
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={() => setAction('reject')}
              >
                Reject Order
              </Button>
            </div>
          ) : (
            <>
              {action === 'accept' && (
                <>
                  <div className="space-y-2">
                    <Label>Production Schedule</Label>
                    <Select
                      value={selectedSchedule}
                      onValueChange={setSelectedSchedule}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select production schedule..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSchedules.map((schedule) => (
                          <SelectItem key={schedule.id} value={schedule.id}>
                            {schedule.name}
                            {schedule.isDefault && ' (Default)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedSchedule && (
                    <AppointmentSchedulePreview
                      scheduleId={selectedSchedule}
                      startDate={new Date()}
                    />
                  )}

                  <div className="space-y-2">
                    <Label>Completion Date</Label>
                    <div className="border rounded-md p-4">
                      <CalendarComponent
                        mode="single"
                        selected={completionDate}
                        onSelect={setCompletionDate}
                        disabled={(date) => date < new Date()}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label>
                  {action === 'accept' ? 'Notes' : 'Rejection Reason'}
                </Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={action === 'accept' 
                    ? 'Add any notes about the order...'
                    : 'Please provide a reason for rejection...'
                  }
                  required={action === 'reject'}
                />
              </div>

              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setAction(null)}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  variant={action === 'reject' ? 'destructive' : 'default'}
                  disabled={action === 'reject' && !notes}
                >
                  {action === 'accept' ? 'Accept Order' : 'Reject Order'}
                </Button>
              </DialogFooter>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}