import { useState } from 'react';
import { Plus, Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScheduleForm } from './schedule-form';
import { useAppointmentSchedules } from '@/stores/appointment-schedules';
import type { AppointmentSchedule } from '@/lib/types/appointment';

export function ScheduleList() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<AppointmentSchedule | null>(null);
  const { schedules, addSchedule, updateSchedule, deleteSchedule } = useAppointmentSchedules();

  const handleAdd = (data: Omit<AppointmentSchedule, 'id'>) => {
    addSchedule(data);
    setShowDialog(false);
  };

  const handleEdit = (data: Omit<AppointmentSchedule, 'id'>) => {
    if (editingSchedule) {
      updateSchedule(editingSchedule.id, data);
      setEditingSchedule(null);
    }
    setShowDialog(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      deleteSchedule(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Appointment Schedules</h2>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Schedule
        </Button>
      </div>

      <div className="grid gap-4">
        {schedules.map((schedule) => (
          <Card key={schedule.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{schedule.name}</h3>
                  <Badge variant="secondary">
                    {schedule.indicationType}
                  </Badge>
                  {schedule.isDefault && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Default
                    </Badge>
                  )}
                </div>
                {schedule.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {schedule.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingSchedule(schedule);
                    setShowDialog(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(schedule.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {schedule.steps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex items-center gap-4 p-2 rounded-lg bg-muted"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{step.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {index === 0 ? (
                      'Start'
                    ) : (
                      `+${step.daysFromPrevious} days`
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {step.duration} minutes
                  </div>
                  {!step.isRequired && (
                    <Badge variant="secondary">Optional</Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}

        {schedules.length === 0 && (
          <Card className="p-6">
            <div className="text-center">
              <p className="text-muted-foreground">No appointment schedules defined</p>
              <Button
                variant="link"
                className="mt-2"
                onClick={() => setShowDialog(true)}
              >
                Add your first schedule
              </Button>
            </div>
          </Card>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingSchedule ? 'Edit Schedule' : 'Add Schedule'}
            </DialogTitle>
          </DialogHeader>
          <ScheduleForm
            initialData={editingSchedule || undefined}
            onSubmit={editingSchedule ? handleEdit : handleAdd}
            onCancel={() => {
              setShowDialog(false);
              setEditingSchedule(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}