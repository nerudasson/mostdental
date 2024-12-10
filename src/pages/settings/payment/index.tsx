import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useStripeStore } from '@/hooks/use-stripe';
import { Card } from '@/components/ui/card';
import { DentistPaymentSettings } from './dentist-payment-settings';
import { LabPaymentSettings } from './lab-payment-settings';

export function PaymentSettingsPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payment Settings</h1>
      
      {user.role === 'dentist' ? (
        <DentistPaymentSettings />
      ) : (
        <LabPaymentSettings />
      )}
    </div>
  );
}