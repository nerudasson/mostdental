import { format } from 'date-fns';
import { Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppointmentSchedules } from '@/stores/appointment-schedules';
import { useAuth } from '@/hooks/use-auth';

interface OrderAppointmentsProps {
  orderId: string;
}

export function OrderAppointments({ orderId }: OrderAppointmentsProps) {
  const { user } = useAuth();
  const { appointments, schedules, updateAppointment } = useAppointmentSchedules();
  
  const orderAppointments = appointments.filter(a => a.orderId === orderId);
  if (!orderAppointments.length) return null;

  const schedule = schedules.find(s => s.id === orderAppointments[0].scheduleId);
  if (!schedule) return null;

  const handleComplete = (appointmentId: string) => {
    updateAppointment(appointmentId, {
      status: 'completed'
    });
  };

  const handleCancel = (appointmentId: string) => {
    updateAppointment(appointmentId, {
      status: 'cancelled'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Schedule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {orderAppointments.map((appointment) => {
          const step = schedule.steps.find(s => s.id === appointment.stepId);
          if (!step) return null;

          return (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{step.name}</span>
                </div>
                <Badge
                  variant="secondary"
                  className={
                    appointment.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : appointment.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }
                >
                  {appointment.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {step.duration} min
                </div>
                <div className="text-sm">
                  {format(appointment.scheduledDate, 'PP')}
                </div>
                {user?.role === 'lab' && appointment.status === 'scheduled' && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleComplete(appointment.id)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Complete
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCancel(appointment.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}