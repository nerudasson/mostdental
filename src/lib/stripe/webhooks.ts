import type { Stripe } from 'stripe';
import { useBillingStore } from '@/stores/billing-store';
import { useNotificationStore } from '@/hooks/use-notifications';

export async function handleStripeWebhook(event: Stripe.Event) {
  const { markStatementAsPaid } = useBillingStore.getState();
  const { addNotification } = useNotificationStore.getState();

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const statementId = paymentIntent.metadata.statementId;

      // Mark statement as paid
      markStatementAsPaid(statementId, paymentIntent.id);

      // Notify lab and dentist
      addNotification({
        type: 'payment_received',
        title: 'Payment Received',
        description: `Payment of €${(paymentIntent.amount / 100).toFixed(2)} has been received`,
        recipientId: paymentIntent.metadata.labId,
        recipientRole: 'lab',
      });

      addNotification({
        type: 'payment_confirmed',
        title: 'Payment Confirmed',
        description: `Your payment of €${(paymentIntent.amount / 100).toFixed(2)} has been processed`,
        recipientId: paymentIntent.metadata.dentistId,
        recipientRole: 'dentist',
      });
      break;
    }

    case 'account.updated': {
      const account = event.data.object as Stripe.Account;
      // Handle Stripe account updates (e.g., completed onboarding)
      if (account.details_submitted && !account.charges_enabled) {
        addNotification({
          type: 'stripe_onboarding',
          title: 'Stripe Account Setup',
          description: 'Please complete your Stripe account verification',
          recipientId: account.metadata.userId,
          recipientRole: 'lab',
        });
      }
      break;
    }

    // Add more webhook handlers as needed
  }
}