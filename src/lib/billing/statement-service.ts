import { addDays, isAfter, isBefore, startOfMonth, endOfMonth } from 'date-fns';
import { useBillingStore } from '@/stores/billing-store';
import { useOrderStore } from '@/lib/orders/store';
import { useNotificationStore } from '@/hooks/use-notifications';
import { BillingFrequency } from '@/lib/types/billing';
import type { Order } from '@/lib/types/order';

class StatementService {
  private static instance: StatementService;

  private constructor() {
    // Initialize service
    this.setupAutoGeneration();
  }

  static getInstance(): StatementService {
    if (!StatementService.instance) {
      StatementService.instance = new StatementService();
    }
    return StatementService.instance;
  }

  private setupAutoGeneration() {
    // Check daily for statements that need to be generated
    setInterval(() => {
      this.generatePendingStatements();
      this.checkOverdueStatements();
    }, 24 * 60 * 60 * 1000); // Run every 24 hours
  }

  async generatePendingStatements() {
    const { settings } = useBillingStore.getState();
    if (!settings.autoGenerateStatements) return;

    const now = new Date();
    if (now.getDate() !== settings.statementDayOfMonth) return;

    const { getOrdersByLab } = useOrderStore.getState();
    const { createStatement } = useBillingStore.getState();
    const { addNotification } = useNotificationStore.getState();

    // Get all completed orders from previous month
    const startDate = startOfMonth(now);
    const endDate = endOfMonth(now);

    // Group orders by lab
    const ordersByLab = new Map<string, Order[]>();
    const orders = getOrdersByLab('');  // Get all orders
    
    orders.forEach(order => {
      if (!ordersByLab.has(order.labId)) {
        ordersByLab.set(order.labId, []);
      }
      ordersByLab.get(order.labId)?.push(order);
    });

    // Generate statements for each lab
    for (const [labId, labOrders] of ordersByLab) {
      const completedOrders = labOrders.filter(order => 
        order.status === 'completed' &&
        isAfter(order.createdAt, startDate) &&
        isBefore(order.createdAt, endDate)
      );

      if (completedOrders.length === 0) continue;

      // Create statement
      const statement = createStatement({
        labId,
        dentistId: completedOrders[0].dentistId,
        orders: completedOrders.map(order => ({
          id: order.id,
          amount: order.totalCost,
          description: `${order.treatment.type} for ${order.patientName}`,
        })),
        period: { startDate, endDate },
      });

      // Notify lab and dentist
      addNotification({
        type: 'statement_generated',
        title: 'Monthly Statement Generated',
        description: `Statement for ${format(startDate, 'MMMM yyyy')} is ready`,
        recipientId: labId,
        recipientRole: 'lab',
      });

      addNotification({
        type: 'payment_due',
        title: 'Payment Due',
        description: `Monthly statement for ${format(startDate, 'MMMM yyyy')} requires payment`,
        recipientId: completedOrders[0].dentistId,
        recipientRole: 'dentist',
      });
    }
  }

  async generateStatementForOrders(orders: Order[]) {
    if (orders.length === 0) return null;

    const { settings } = useBillingStore.getState();
    if (settings.billingFrequency !== BillingFrequency.PER_ORDER) return null;

    const { createStatement } = useBillingStore.getState();
    const { addNotification } = useNotificationStore.getState();

    // Create statement
    const statement = createStatement({
      labId: orders[0].labId,
      dentistId: orders[0].dentistId,
      orders: orders.map(order => ({
        id: order.id,
        amount: order.totalCost,
        description: `${order.treatment.type} for ${order.patientName}`,
      })),
    });

    // Notify lab and dentist
    addNotification({
      type: 'statement_generated',
      title: 'Statement Generated',
      description: `Statement for order ${orders.map(o => o.id).join(', ')} is ready`,
      recipientId: orders[0].labId,
      recipientRole: 'lab',
    });

    addNotification({
      type: 'payment_due',
      title: 'Payment Due',
      description: `Statement for order ${orders.map(o => o.id).join(', ')} requires payment`,
      recipientId: orders[0].dentistId,
      recipientRole: 'dentist',
    });

    return statement;
  }

  private checkOverdueStatements() {
    const { settings, statements } = useBillingStore.getState();
    if (!settings.reminderEnabled) return;

    const { addNotification } = useNotificationStore.getState();
    const now = new Date();

    statements
      .filter(statement => 
        statement.status === 'pending' &&
        isAfter(now, addDays(statement.createdAt, settings.reminderDays))
      )
      .forEach(statement => {
        // Send reminder notifications
        addNotification({
          type: 'payment_reminder',
          title: 'Payment Reminder',
          description: `Payment for statement #${statement.id} is overdue`,
          recipientId: statement.dentistId,
          recipientRole: 'dentist',
        });

        addNotification({
          type: 'payment_overdue',
          title: 'Payment Overdue',
          description: `Payment for statement #${statement.id} is overdue`,
          recipientId: statement.labId,
          recipientRole: 'lab',
        });
      });
  }
}

export const statementService = StatementService.getInstance();