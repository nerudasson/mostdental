import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScannerSettingsPage } from './scanner';
import { LabScannerPage } from './scanner/lab-scanner';
import { PaymentSettingsPage } from './payment';
import { TeamSettingsPage } from './team';
import { ProfileSettingsPage } from './profile';
import { AppointmentSchedulesPage } from './appointment-schedules';
import { PricingSettingsPage } from './pricing';
import { useAuth } from '@/hooks/use-auth';

export function SettingsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('nav.settings')}</h1>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="scanner">
            {user?.role === 'dentist' ? 'Scanner' : 'Integrations'}
          </TabsTrigger>
          {user?.role === 'lab' && (
            <>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </>
          )}
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileSettingsPage />
        </TabsContent>
        <TabsContent value="scanner">
          {user?.role === 'dentist' ? <ScannerSettingsPage /> : <LabScannerPage />}
        </TabsContent>
        {user?.role === 'lab' && (
          <>
            <TabsContent value="appointments">
              <AppointmentSchedulesPage />
            </TabsContent>
            <TabsContent value="pricing">
              <PricingSettingsPage />
            </TabsContent>
          </>
        )}
        <TabsContent value="payment">
          <PaymentSettingsPage />
        </TabsContent>
        <TabsContent value="team">
          <TeamSettingsPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}