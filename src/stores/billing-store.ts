import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BillingSettings, PaymentStatement } from '@/lib/types/billing';
import { BillingFrequency, PaymentTiming } from '@/lib/types/billing';

interface BillingStore {
  settings: BillingSettings;
  statements: PaymentStatement[];
  updateSettings: (updates: Partial<BillingSettings>) => void;
  createStatement: (params: {
    labId: string;
    dentistId: string;
    orders: Array<{ id: string; amount: number; description: string }>;
    period?: { startDate: Date; endDate: Date };
  }) => PaymentStatement;
  getStatementsByLab: (labId: string) => PaymentStatement[];
  getStatementsByDentist: (dentistId: string) => PaymentStatement[];
  markStatementAsPaid: (statementId: string, paymentIntentId: string) => void;
}

const defaultSettings: BillingSettings = {
  billingFrequency: BillingFrequency.MONTHLY,
  paymentTiming: PaymentTiming.DELAYED,
  autoGenerateStatements: true,
  statementDayOfMonth: 1,
  reminderEnabled: true,
  reminderDays: 7,
};

export const useBillingStore = create<BillingStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      statements: [],

      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      createStatement: ({ labId, dentistId, orders, period }) => {
        const statement: PaymentStatement = {
          id: crypto.randomUUID(),
          labId,
          dentistId,
          orders,
          period,
          totalAmount: orders.reduce((sum, order) => sum + order.amount, 0),
          status: 'pending',
          createdAt: new Date(),
        };

        set((state) => ({
          statements: [...state.statements, statement],
        }));

        return statement;
      },

      getStatementsByLab: (labId) => {
        return get().statements.filter((statement) => statement.labId === labId);
      },

      getStatementsByDentist: (dentistId) => {
        return get().statements.filter(
          (statement) => statement.dentistId === dentistId
        );
      },

      markStatementAsPaid: (statementId, paymentIntentId) => {
        set((state) => ({
          statements: state.statements.map((statement) =>
            statement.id === statementId
              ? {
                  ...statement,
                  status: 'paid',
                  stripePaymentIntentId: paymentIntentId,
                  paidAt: new Date(),
                }
              : statement
          ),
        }));
      },
    }),
    {
      name: 'billing-storage',
    }
  )
);