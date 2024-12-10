import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addDays, isAfter } from 'date-fns';

interface Invoice {
  id: string;
  number: string;
  date: Date;
  dueDate: Date;
  labId: string;
  dentistId: string;
  patientId: string;
  orderId: string;
  positions: Array<{
    code: string;
    description: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paidAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface InvoiceStore {
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'number' | 'createdAt' | 'updatedAt'>) => string;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoice: (id: string) => Invoice | undefined;
  getInvoicesByLab: (labId: string) => Invoice[];
  getInvoicesByDentist: (dentistId: string) => Invoice[];
  getOverdueInvoices: () => Invoice[];
  markAsPaid: (id: string, amount: number) => void;
}

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      invoices: [],

      addInvoice: (invoice) => {
        const id = crypto.randomUUID();
        const number = generateInvoiceNumber();
        const now = new Date();
        
        const newInvoice: Invoice = {
          ...invoice,
          id,
          number,
          createdAt: now,
          updatedAt: now,
          status: 'draft',
          paidAmount: 0,
        };

        set((state) => ({
          invoices: [...state.invoices, newInvoice],
        }));

        return id;
      },

      updateInvoice: (id, updates) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id
              ? { ...invoice, ...updates, updatedAt: new Date() }
              : invoice
          ),
        }));
      },

      deleteInvoice: (id) => {
        set((state) => ({
          invoices: state.invoices.filter((invoice) => invoice.id !== id),
        }));
      },

      getInvoice: (id) => {
        return get().invoices.find((invoice) => invoice.id === id);
      },

      getInvoicesByLab: (labId) => {
        return get().invoices.filter((invoice) => invoice.labId === labId);
      },

      getInvoicesByDentist: (dentistId) => {
        return get().invoices.filter((invoice) => invoice.dentistId === dentistId);
      },

      getOverdueInvoices: () => {
        const now = new Date();
        return get().invoices.filter(
          (invoice) =>
            invoice.status !== 'paid' && isAfter(now, invoice.dueDate)
        );
      },

      markAsPaid: (id, amount) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id
              ? {
                  ...invoice,
                  paidAmount: invoice.paidAmount + amount,
                  status: invoice.paidAmount + amount >= invoice.totalAmount ? 'paid' : invoice.status,
                  updatedAt: new Date(),
                }
              : invoice
          ),
        }));
      },
    }),
    {
      name: 'invoice-storage',
    }
  )
);

// Helper function to generate invoice numbers
function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}-${random}`;
}