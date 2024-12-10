import { create } from 'zustand';
import { createPaymentIntent } from '@/lib/stripe';
import { useNotificationStore } from '@/hooks/use-notifications';
import { useToast } from '@/hooks/use-toast';

interface PaymentStore {
  processing: boolean;
  processPayment: (params: {
    amount: number;
    labAccountId: string;
    customerId: string;
    paymentMethodId: string;
    orderId: string;
    description?: string;
  }) => Promise<boolean>;
}

export const usePayment = create<PaymentStore>((set, get) => ({
  processing: false,

  processPayment: async (params) => {
    const { toast } = useToast.getState();
    const addNotification = useNotificationStore.getState().addNotification;

    set({ processing: true });
    try {
      const paymentIntent = await createPaymentIntent(params);

      if (paymentIntent.status === 'succeeded') {
        toast({
          title: 'Payment successful',
          description: 'Your payment has been processed successfully.',
        });

        addNotification({
          type: 'order_message',
          title: 'Payment Initiated',
          description: `Payment of €${(params.amount / 100).toFixed(2)} is being processed`,
          orderId: params.orderId,
        });

        return true;
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      toast({
        title: 'Payment failed',
        description: error instanceof Error ? error.message : 'Failed to process payment',
        variant: 'destructive',
      });
      return false;
    } finally {
      set({ processing: false });
    }
  },
}));