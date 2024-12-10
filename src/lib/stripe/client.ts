import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with publishable key
export const stripe = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export async function createPaymentSession(params: {
  statementId: string;
  amount: number;
  labAccountId: string;
  customerId?: string;
}) {
  const response = await fetch('/api/create-payment-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to create payment session');
  }

  const { sessionId } = await response.json();
  return sessionId;
}

export async function handlePayment(sessionId: string) {
  const stripeInstance = await stripe;
  if (!stripeInstance) throw new Error('Stripe not initialized');

  const { error } = await stripeInstance.redirectToCheckout({
    sessionId,
  });

  if (error) {
    throw error;
  }
}