import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addDays } from 'date-fns';
import type { AppointmentSchedule, ScheduledAppointment } from '@/lib/types/appointment';

interface AppointmentScheduleStore {
  schedules: AppointmentSchedule[];
  appointments: ScheduledAppointment[];
  
  // Schedule template management
  addSchedule: (schedule: Omit<AppointmentSchedule, 'id'>) => string;
  updateSchedule: (id: string, updates: Partial<AppointmentSchedule>) => void;
  deleteSchedule: (id: string) => void;
  getSchedulesByIndication: (indicationType: string) => AppointmentSchedule[];
  
  // Appointment scheduling
  scheduleAppointments: (orderId: string, scheduleId: string, startDate: Date) => ScheduledAppointment[];
  updateAppointment: (appointmentId: string, updates: Partial<ScheduledAppointment>) => void;
  getAppointmentsForOrder: (orderId: string) => ScheduledAppointment[];
  calculateAppointmentDates: (scheduleId: string, startDate: Date) => Date[];
}

export const useAppointmentSchedules = create<AppointmentScheduleStore>()(
  persist(
    (set, get) => ({
      schedules: [],
      appointments: [],

      addSchedule: (schedule) => {
        const id = crypto.randomUUID();
        set((state) => ({
          schedules: [...state.schedules, { ...schedule, id }],
        }));
        return id;
      },

      updateSchedule: (id, updates) => {
        set((state) => ({
          schedules: state.schedules.map((schedule) =>
            schedule.id === id ? { ...schedule, ...updates } : schedule
          ),
        }));
      },

      deleteSchedule: (id) => {
        set((state) => ({
          schedules: state.schedules.filter((schedule) => schedule.id !== id),
        }));
      },

      getSchedulesByIndication: (indicationType) => {
        return get().schedules.filter(
          (schedule) => schedule.indicationType === indicationType
        );
      },

      scheduleAppointments: (orderId, scheduleId, startDate) => {
        const schedule = get().schedules.find((s) => s.id === scheduleId);
        if (!schedule) return [];

        const appointments: ScheduledAppointment[] = [];
        let currentDate = startDate;

        schedule.steps.forEach((step) => {
          if (step.daysFromPrevious > 0) {
            currentDate = addDays(currentDate, step.daysFromPrevious);
          }

          const appointment: ScheduledAppointment = {
            id: crypto.randomUUID(),
            scheduleId,
            stepId: step.id,
            orderId,
            scheduledDate: currentDate,
            status: 'scheduled',
          };

          appointments.push(appointment);
        });

        set((state) => ({
          appointments: [...state.appointments, ...appointments],
        }));

        return appointments;
      },

      updateAppointment: (appointmentId, updates) => {
        set((state) => ({
          appointments: state.appointments.map((appointment) =>
            appointment.id === appointmentId
              ? { ...appointment, ...updates }
              : appointment
          ),
        }));
      },

      getAppointmentsForOrder: (orderId) => {
        return get().appointments.filter(
          (appointment) => appointment.orderId === orderId
        );
      },

      calculateAppointmentDates: (scheduleId, startDate) => {
        const schedule = get().schedules.find((s) => s.id === scheduleId);
        if (!schedule) return [];

        const dates: Date[] = [];
        let currentDate = startDate;

        schedule.steps.forEach((step) => {
          if (step.daysFromPrevious > 0) {
            currentDate = addDays(currentDate, step.daysFromPrevious);
          }
          dates.push(currentDate);
        });

        return dates;
      },
    }),
    {
      name: 'appointment-schedules',
    }
  )
);