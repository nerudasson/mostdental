import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IndicationType } from '@/lib/scanner/types';
import type { AppointmentSchedule, AppointmentStep } from '@/lib/types/appointment';

interface ScheduleFormProps {
  initialData?: Partial<AppointmentSchedule>;
  onSubmit: (data: Omit<AppointmentSchedule, 'id'>) => void;
  onCancel: () => void;
}

export function ScheduleForm({ initialData, onSubmit, onCancel }: ScheduleFormProps) {
  const [formData, setFormData] = useState<Partial<AppointmentSchedule>>({
    name: '',
    description: '',
    indicationType: IndicationType.CROWN,
    steps: [],
    isDefault: false,
    ...initialData,
  });

  const handleAddStep = () => {
    const newStep: AppointmentStep = {
      id: crypto.randomUUID(),
      name: '',
      daysFromPrevious: 0,
      duration: 30,
      isRequired: true,
    };

    setFormData((prev) => ({
      ...prev,
      steps: [...(prev.steps || []), newStep],
    }));
  };

  const handleRemoveStep = (stepId: string) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps?.filter((step) => step.id !== stepId),
    }));
  };

  const handleStepChange = (stepId: string, field: keyof AppointmentStep, value: any) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps?.map((step) =>
        step.id === stepId ? { ...step, [field]: value } : step
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.indicationType || !formData.steps?.length) return;
    onSubmit(formData as Omit<AppointmentSchedule, 'id'>);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label>Indication Type</Label>
          <Select
            value={formData.indicationType}
            onValueChange={(value) =>
              setFormData({ ...formData, indicationType: value as IndicationType })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(IndicationType).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Schedule Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Standard Crown Schedule"
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the appointment schedule..."
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.isDefault}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isDefault: checked })
            }
          />
          <Label>Set as default schedule for this indication</Label>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Appointment Steps</Label>
          <Button type="button" onClick={handleAddStep} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </div>

        <div className="space-y-4">
          {formData.steps?.map((step, index) => (
            <div
              key={step.id}
              className="grid grid-cols-12 gap-4 items-start border p-4 rounded-lg"
            >
              <div className="col-span-4 space-y-2">
                <Label>Step Name</Label>
                <Input
                  value={step.name}
                  onChange={(e) => handleStepChange(step.id, 'name', e.target.value)}
                  placeholder="e.g., Initial Consultation"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Days After Previous</Label>
                <Input
                  type="number"
                  min="0"
                  value={step.daysFromPrevious}
                  onChange={(e) =>
                    handleStepChange(step.id, 'daysFromPrevious', parseInt(e.target.value))
                  }
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Duration (min)</Label>
                <Input
                  type="number"
                  min="0"
                  step="15"
                  value={step.duration}
                  onChange={(e) =>
                    handleStepChange(step.id, 'duration', parseInt(e.target.value))
                  }
                />
              </div>

              <div className="col-span-3 space-y-2">
                <Label>Required</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    checked={step.isRequired}
                    onCheckedChange={(checked) =>
                      handleStepChange(step.id, 'isRequired', checked)
                    }
                  />
                  <span className="text-sm text-muted-foreground">
                    {step.isRequired ? 'Required' : 'Optional'}
                  </span>
                </div>
              </div>

              <div className="col-span-1 pt-8">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveStep(step.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!formData.name || !formData.indicationType || !formData.steps?.length}
        >
          Save Schedule
        </Button>
      </div>
    </form>
  );
}