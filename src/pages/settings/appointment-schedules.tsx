import { useTranslation } from 'react-i18next';
import { ScheduleList } from '@/components/settings/appointment-schedules/schedule-list';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function AppointmentSchedulesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (user?.role !== 'lab') {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Only lab users can access appointment schedule settings.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Appointment Schedules</h1>
          <p className="text-muted-foreground mt-1">
            Define guaranteed delivery schedules for different types of dental work
          </p>
        </div>
      </div>

      <Card className="p-6">
        <ScheduleList />
      </Card>
    </div>
  );
}