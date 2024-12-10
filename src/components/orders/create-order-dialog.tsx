import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useOrderStore } from '@/lib/orders/store';
import { useNotificationStore } from '@/hooks/use-notifications';
import { useAppointmentSchedules } from '@/stores/appointment-schedules';
import { AppointmentSchedulePreview } from './appointment-schedule-preview';
import type { ImpressionType } from '@/lib/types/order';

interface CreateOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estimate: any;
}

const timeSlots = [
  { value: 'morning', label: '9:00 - 12:00' },
  { value: 'afternoon', label: '12:00 - 15:00' },
  { value: 'evening', label: '15:00 - 18:00' },
];

export function CreateOrderDialog({
  open,
  onOpenChange,
  estimate,
}: CreateOrderDialogProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addOrder } = useOrderStore();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const { getSchedulesByIndication } = useAppointmentSchedules();
  
  const [impressionType, setImpressionType] = useState<ImpressionType>('digital_scan');
  const [selectedScanner, setSelectedScanner] = useState('');
  const [pickupDate, setPickupDate] = useState<Date>();
  const [pickupTimeSlot, setPickupTimeSlot] = useState('');
  const [pickupNotes, setPickupNotes] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<string>('');

  // Only proceed if we have a valid estimate
  if (!estimate?.treatment?.type) {
    return null;
  }

  // Get available schedules for this indication
  const availableSchedules = getSchedulesByIndication(estimate.treatment.type);
  const defaultSchedule = availableSchedules.find(s => s.isDefault);

  // Set default schedule when dialog opens
  useState(() => {
    if (defaultSchedule) {
      setSelectedSchedule(defaultSchedule.id);
    }
  }, [defaultSchedule]);

  const handleSubmit = () => {
    // Validate required fields
    if (impressionType === 'physical' && (!pickupDate || !pickupTimeSlot)) {
      toast({
        title: 'Missing information',
        description: 'Please select pickup date and time slot',
        variant: 'destructive',
      });
      return;
    }

    if (impressionType === 'digital_scan' && !selectedScanner) {
      toast({
        title: 'Missing information',
        description: 'Please select a scanner',
        variant: 'destructive',
      });
      return;
    }

    // Create order
    const orderId = crypto.randomUUID();
    const order = {
      id: orderId,
      dentistId: estimate.dentist.id,
      dentistName: estimate.dentist.name,
      practice: estimate.dentist.practice,
      patientId: estimate.patient.id,
      patientName: estimate.patient.name,
      treatment: estimate.treatment,
      status: 'pending_checkin',
      createdAt: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      totalCost: estimate.totalCost,
      impressionType,
      ...(impressionType === 'digital_scan' ? {
        scannerType: selectedScanner,
        scans: {
          status: 'pending',
          count: 0,
        },
      } : {
        pickupDetails: {
          type: 'pickup',
          preferredDate: pickupDate,
          preferredTimeSlot: pickupTimeSlot,
          notes: pickupNotes,
          status: 'pending',
        },
      }),
    };

    addOrder(order);

    // Schedule appointments if a schedule was selected
    if (selectedSchedule) {
      const { scheduleAppointments } = useAppointmentSchedules.getState();
      scheduleAppointments(orderId, selectedSchedule, new Date());
    }

    // Notify lab
    addNotification({
      type: 'order_created',
      title: 'New Order Received',
      description: `New order from ${estimate.dentist.name} for ${estimate.patient.name}`,
      orderId,
    });

    toast({
      title: 'Order created',
      description: 'The lab has been notified of your new order.',
    });

    onOpenChange(false);
    navigate(`/orders/${orderId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Impression Type</Label>
            <Select
              value={impressionType}
              onValueChange={(value: ImpressionType) => setImpressionType(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="digital_scan">Digital Scan</SelectItem>
                <SelectItem value="physical">Physical Impression</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {impressionType === 'digital_scan' ? (
            <div className="space-y-2">
              <Label>Scanner</Label>
              <Select
                value={selectedScanner}
                onValueChange={setSelectedScanner}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select scanner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trios">3Shape TRIOS</SelectItem>
                  <SelectItem value="itero">iTero</SelectItem>
                  <SelectItem value="medit">Medit i500</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Preferred Pickup Date</Label>
                <Calendar
                  mode="single"
                  selected={pickupDate}
                  onSelect={setPickupDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>

              <div className="space-y-2">
                <Label>Preferred Time Slot</Label>
                <Select
                  value={pickupTimeSlot}
                  onValueChange={setPickupTimeSlot}
                >
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
                <Label>Pickup Notes</Label>
                <Textarea
                  value={pickupNotes}
                  onChange={(e) => setPickupNotes(e.target.value)}
                  placeholder="Add any notes for pickup..."
                />
              </div>
            </>
          )}

          {availableSchedules.length > 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Production Schedule</Label>
                <Select
                  value={selectedSchedule}
                  onValueChange={setSelectedSchedule}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select schedule..." />
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
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}