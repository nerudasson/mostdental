import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from '@/lib/imports/ui';
import { ToothSchema } from '@/components/tooth-schema';
import { useVDDS } from '@/hooks/use-vdds';
import type { VDDSPatient } from '@/lib/vdds/types';

interface TreatmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: VDDSPatient;
}

export function TreatmentForm({
  open,
  onOpenChange,
  patient,
}: TreatmentFormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedTeeth, setSelectedTeeth] = useState<string[]>([]);
  const { getPatientBefunde } = useVDDS();
  const [befunde, setBefunde] = useState<Record<string, string>>({});

  // Load Befunde from VDDS when form opens
  useEffect(() => {
    if (open && patient.id) {
      getPatientBefunde(patient.id)
        .then(importedBefunde => {
          setBefunde(importedBefunde);
        })
        .catch(console.error);
    }
  }, [open, patient.id]);

  const handleToothClick = (toothId: string) => {
    setSelectedTeeth(prev => 
      prev.includes(toothId)
        ? prev.filter(id => id !== toothId)
        : [...prev, toothId]
    );
  };

  const handleBefundChange = (toothId: string, code: any) => {
    setBefunde(prev => ({
      ...prev,
      [toothId]: code
    }));
  };

  const handleContinue = () => {
    if (Object.keys(befunde).length > 0) {
      // Navigate to product selection with state
      navigate('/product-selection', {
        state: {
          patient,
          selectedTeeth,
          befunde,
        },
      });
      
      // Close current dialog
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>
            {patient.firstName} {patient.lastName}{' '}
            <span className="text-muted-foreground ml-2">ID: {patient.id}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <p className="text-muted-foreground">{t('costEstimate.checkPlan')}</p>

          <ToothSchema 
            selectedTeeth={selectedTeeth}
            onToothClick={handleToothClick}
            befunde={befunde}
            onBefundChange={handleBefundChange}
          />

          <div className="flex justify-end">
            <Button 
              onClick={handleContinue}
              disabled={Object.keys(befunde).length === 0}
            >
              {t('common.continue')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}