import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CostEstimatesTable } from '@/components/cost-estimate/cost-estimates-table';
import { PatientSearchDialog } from '@/components/cost-estimate/patient-search-dialog';
import { TreatmentForm } from '@/components/cost-estimate/treatment-form';
import { useState } from 'react';

export function DashboardPage() {
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('nav.dashboard')}</h1>
        <Button onClick={() => setSearchDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('costEstimate.title')}
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Cost Estimates</h2>
          <CostEstimatesTable />
        </div>
      </div>

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