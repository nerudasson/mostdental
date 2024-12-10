import { z } from 'zod';

export const invoiceSchema = z.object({
  id: z.string(),
  number: z.string(),
  date: z.date(),
  dueDate: z.date(),
  labId: z.string(),
  dentistId: z.string(),
  patientId: z.string(),
  orderId: z.string(),
  positions: z.array(z.object({
    code: z.string(),
    description: z.string(),
    quantity: z.number(),
    price: z.number(),
    type: z.enum(['BEL', 'BEB']),
  })),
  totalAmount: z.number(),
  paidAmount: z.number().default(0),
  status: z.enum(['draft', 'sent', 'paid', 'overdue']),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  paymentDue: z.date(),
  paymentTerms: z.number().default(30), // days
  bankDetails: z.object({
    bank: z.string(),
    iban: z.string(),
    bic: z.string(),
  }),
  stripeInvoiceId: z.string().optional(),
  stripePaymentUrl: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type Invoice = z.infer<typeof invoiceSchema>;

export interface Position {
  code: string;
  description: string;
  quantity: number;
  price: number;
  type: 'BEL' | 'BEB';
}