import { z } from 'zod';

export enum BillingFrequency {
  PER_ORDER = 'per_order',
  MONTHLY = 'monthly'
}

export enum PaymentTiming {
  IMMEDIATE = 'immediate',
  DELAYED = 'delayed'
}

export const billingSettingsSchema = z.object({
  stripeAccountId: z.string().optional(),
  billingFrequency: z.nativeEnum(BillingFrequency),
  paymentTiming: z.nativeEnum(PaymentTiming),
  autoGenerateStatements: z.boolean().default(true),
  statementDayOfMonth: z.number().min(1).max(28).optional(),
  reminderEnabled: z.boolean().default(true),
  reminderDays: z.number().min(1).max(30).default(7),
});

export type BillingSettings = z.infer<typeof billingSettingsSchema>;

export interface PaymentStatement {
  id: string;
  labId: string;
  dentistId: string;
  period?: {
    startDate: Date;
    endDate: Date;
  };
  orders: Array<{
    id: string;
    amount: number;
    description: string;
  }>;
  totalAmount: number;
  status: 'pending' | 'paid' | 'overdue';
  stripePaymentIntentId?: string;
  createdAt: Date;
  paidAt?: Date;
}