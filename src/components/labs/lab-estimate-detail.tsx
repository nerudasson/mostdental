import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DentistInfoCard } from './estimate/dentist-info-card';
import { TreatmentInfoCard } from './estimate/treatment-info-card';
import { TreatmentPlanCard } from './estimate/treatment-plan-card';
import { PricingCard } from './estimate/pricing-card';
import { format } from 'date-fns';

interface LabEstimateDetailProps {
  estimateId?: string;
}

// Mock data - in real app, fetch based on estimateId
const mockEstimate = {
  id: 'LCE001',
  dentist: {
    name: 'Dr. Smith',
    practice: 'Smith Dental',
    email: 'dr.smith@example.com',
    phone: '+49 123 456789',
    address: 'Dental Street 123, 12345 City',
  },
  patient: {
    id: '#3454',
    name: 'Jack Smile',
  },
  treatment: {
    type: 'Bridge Metal',
    description: 'Bridge 13-15',
    teeth: ['13', '14', '15'],
    notes: 'Patient prefers metal over ceramic due to cost considerations',
    befunde: {
      '13': 'k',
      '14': 'f',
      '15': 'k',
    },
    regelversorgung: {
      '13': 'KB',
      '14': 'B',
      '15': 'KB',
    },
    therapie: {
      '13': 'KB',
      '14': 'B',
      '15': 'KB',
    },
  },
  requestedDate: new Date('2024-02-20'),
  status: 'pending',
};

export function LabEstimateDetail({ estimateId }: LabEstimateDetailProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Cost Estimate {mockEstimate.id}</h1>
            <p className="text-sm text-muted-foreground">
              Requested on {format(mockEstimate.requestedDate, 'PPP')}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <DentistInfoCard dentist={mockEstimate.dentist} />
        <TreatmentInfoCard 
          patient={mockEstimate.patient}
          treatment={mockEstimate.treatment}
        />
      </div>

      <TreatmentPlanCard treatment={mockEstimate.treatment} />
      <PricingCard />
    </div>
  );
}