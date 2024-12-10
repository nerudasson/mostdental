import Stripe from 'stripe';

// Initialize Stripe with platform account secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2023-10-16',
});

// Platform fee percentage (0% for now)
const PLATFORM_FEE_PERCENT = 0;

export async function createPaymentIntent({
  amount,
  labAccountId,
  customerId,
  paymentMethodId,
}: {
  amount: number;
  labAccountId: string;
  customerId: string;
  paymentMethodId: string;
}) {
  try {
    // Calculate platform fee
    const platformFee = Math.round(amount * (PLATFORM_FEE_PERCENT / 100));

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      payment_method: paymentMethodId,
      customer: customerId,
      confirm: true,
      application_fee_amount: platformFee,
      transfer_data: {
        destination: labAccountId,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

export async function createCustomer({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    });

    return customer;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}

export async function createConnectedAccount({
  email,
  businessName,
}: {
  email: string;
  businessName: string;
}) {
  try {
    // Create a Connected Account
    const account = await stripe.accounts.create({
      type: 'express',
      email,
      business_type: 'company',
      company: {
        name: businessName,
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${window.location.origin}/settings/payment?refresh=true`,
      return_url: `${window.location.origin}/settings/payment?success=true`,
      type: 'account_onboarding',
    });

    return {
      accountId: account.id,
      onboardingUrl: accountLink.url,
    };
  } catch (error) {
    console.error('Error creating connected account:', error);
    throw error;
  }
}

export async function retrieveAccountStatus(accountId: string) {
  try {
    const account = await stripe.accounts.retrieve(accountId);
    return {
      isEnabled: account.charges_enabled && account.payouts_enabled,
      details_submitted: account.details_submitted,
    };
  } catch (error) {
    console.error('Error retrieving account status:', error);
    throw error;
  }
}

export async function attachPaymentMethod({
  customerId,
  paymentMethodId,
}: {
  customerId: string;
  paymentMethodId: string;
}) {
  try {
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    return true;
  } catch (error) {
    console.error('Error attaching payment method:', error);
    throw error;
  }
}

export async function listPaymentMethods(customerId: string) {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return paymentMethods.data;
  } catch (error) {
    console.error('Error listing payment methods:', error);
    throw error;
  }
}

export async function detachPaymentMethod(paymentMethodId: string) {
  try {
    await stripe.paymentMethods.detach(paymentMethodId);
    return true;
  } catch (error) {
    console.error('Error detaching payment method:', error);
    throw error;
  }
}