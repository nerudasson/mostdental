import { format } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppointmentSchedules } from '@/stores/appointment-schedules';

interface AppointmentSchedulePreviewProps {
  scheduleId: string;
  startDate: Date;
}

export function AppointmentSchedulePreview({
  scheduleId,
  startDate,
}: AppointmentSchedulePreviewProps) {
  const { schedules, calculateAppointmentDates } = useAppointmentSchedules();
  const schedule = schedules.find((s) => s.id === scheduleId);

  if (!schedule) {
    return null;
  }

  const dates = calculateAppointmentDates(scheduleId, startDate);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Delivery Schedule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {schedule.steps.map((step, index) => (
          <div
            key={step.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{step.name}</span>
              </div>
              {!step.isRequired && (
                <Badge variant="secondary">Optional</Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {step.duration} min
              </div>
              <div>
                {format(dates[index], 'PP')}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}