import { useTranslation } from 'react-i18next';
import { Plus, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DueOrders } from '@/components/dashboard/due-orders';
import { HKPQuoteChart } from '@/components/dashboard/hkp-quote-chart';
import { ExpiringEstimates } from '@/components/dashboard/expiring-estimates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PatientSearchDialog } from '@/components/cost-estimate/patient-search-dialog';
import { TreatmentForm } from '@/components/cost-estimate/treatment-form';
import { SecureSendButton } from '@/components/secure-send';
import { useState } from 'react';

const mockStats = [
  {
    title: 'Ausstehende KVAs',
    value: '8',
    description: '3 neue diese Woche',
    trend: '+12.5%',
    trendDirection: 'up',
  },
  {
    title: 'Aktive Aufträge',
    value: '15',
    description: '5 in Produktion',
    trend: '+8.2%',
    trendDirection: 'up',
  },
  {
    title: 'Fällige Termine',
    value: '4',
    description: 'Diese Woche',
    trend: '-2.1%',
    trendDirection: 'down',
  },
  {
    title: 'Umsatz (MTD)',
    value: '€12.450',
    description: 'Mai 2024',
    trend: '+15.3%',
    trendDirection: 'up',
  },
];

export function DentistDashboard() {
  const { t } = useTranslation();
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [treatmentFormOpen, setTreatmentFormOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<{
    id: string;
    name: string;
    treatmentPlan: string;
  } | null>(null);

  const handlePatientSelect = (patient: {
    id: string;
    name: string;
    treatmentPlan: string;
  }) => {
    setSelectedPatient(patient);
    setSearchDialogOpen(false);
    setTreatmentFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">{t('nav.dashboard')}</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <SecureSendButton />
          <Button 
            onClick={() => setSearchDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Kostenvoranschlag erstellen
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
              <div className={`text-xs mt-2 ${
                stat.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Anstehende Aufträge</CardTitle>
          </CardHeader>
          <CardContent>
            <DueOrders />
          </CardContent>
        </Card>

        <Card className="hidden lg:block">
          <CardHeader>
            <CardTitle>HKP Umwandlungsrate</CardTitle>
          </CardHeader>
          <CardContent>
            <HKPQuoteChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle>Ablaufende Kostenvoranschläge</CardTitle>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Erinnerungen senden
          </Button>
        </CardHeader>
        <CardContent>
          <ExpiringEstimates />
        </CardContent>
      </Card>

      <PatientSearchDialog
        open={searchDialogOpen}
        onOpenChange={setSearchDialogOpen}
        onPatientSelect={handlePatientSelect}
      />
      
      {selectedPatient && (
        <TreatmentForm
          open={treatmentFormOpen}
          onOpenChange={setTreatmentFormOpen}
          patient={selectedPatient}
        />
      )}
    </div>
  );
}