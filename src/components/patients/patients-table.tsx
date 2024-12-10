import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { PatientSearchDialog } from '@/components/cost-estimate/patient-search-dialog';
import { TreatmentForm } from '@/components/cost-estimate/treatment-form';

const data = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+49 123 456789',
    lastVisit: new Date('2024-02-15'),
    nextVisit: new Date('2024-08-15'),
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+49 987 654321',
    lastVisit: new Date('2024-01-20'),
    nextVisit: new Date('2024-07-20'),
    status: 'pending',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+49 456 789123',
    lastVisit: new Date('2023-12-10'),
    nextVisit: null,
    status: 'inactive',
  },
] as const;

export function PatientsTable() {
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">
          {t('patients.title')}
        </h2>
        <Button onClick={() => setSearchDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('costEstimate.title')}
        </Button>
      </div>
      
      <DataTable columns={columns} data={data} searchKey="name" />
      
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