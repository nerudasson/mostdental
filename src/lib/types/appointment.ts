import { z } from 'zod';
import { IndicationType } from '../scanner/types';

export const appointmentStepSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  daysFromPrevious: z.number().min(0),
  duration: z.number().min(0), // in minutes
  isRequired: z.boolean().default(true),
});

export const appointmentScheduleSchema = z.object({
  id: z.string(),
  indicationType: z.nativeEnum(IndicationType),
  name: z.string(),
  description: z.string().optional(),
  steps: z.array(appointmentStepSchema),
  isDefault: z.boolean().default(false),
});

export type AppointmentStep = z.infer<typeof appointmentStepSchema>;
export type AppointmentSchedule = z.infer<typeof appointmentScheduleSchema>;

export interface ScheduledAppointment {
  id: string;
  scheduleId: string;
  stepId: string;
  orderId: string;
  scheduledDate: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}