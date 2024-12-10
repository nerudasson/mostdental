import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X, AlertCircle, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface PatientSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientSelect: (patient: any) => void;
}

// Mock data for development
const mockPatients = [
  {
    id: 'P001',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('1980-05-15'),
    insurance: {
      type: 'public',
      provider: 'AOK',
      number: '123456789',
      bonusYears: 10
    },
    befunde: {
      '11': 'k',
      '12': 'f',
      '21': 'e'
    }
  },
  {
    id: 'P002',
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: new Date('1975-08-22'),
    insurance: {
      type: 'private',
      provider: 'DKV',
      number: '987654321',
      bonusYears: 5
    },
    befunde: {
      '14': 'k',
      '15': 'f',
      '16': 'e'
    }
  },
  {
    id: 'P003',
    firstName: 'Mike',
    lastName: 'Johnson',
    dateOfBirth: new Date('1990-03-10'),
    insurance: {
      type: 'public',
      provider: 'TK',
      number: '456789123',
      bonusYears: 8
    },
    befunde: {
      '24': 'k',
      '25': 'f',
      '26': 'kw'
    }
  }
];

export function PatientSearchDialog({
  open,
  onOpenChange,
  onPatientSelect,
}: PatientSearchDialogProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(mockPatients);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    
    // Filter mock data
    const filteredResults = mockPatients.filter(patient => 
      patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Simulate API delay
    setTimeout(() => {
      setResults(filteredResults);
      setLoading(false);
    }, 500);
  };

  const handlePatientSelect = async (patient: any) => {
    onPatientSelect(patient);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{t('costEstimate.title')}</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('patients.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-9"
          />
        </div>

        <ScrollArea className="h-[300px] rounded-md border">
          <div className="p-4">
            {loading ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-2">
                {results.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => handlePatientSelect(patient)}
                    className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          {patient.firstName} {patient.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {patient.id} • DOB: {patient.dateOfBirth.toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Insurance: {patient.insurance.type} • Bonus Years: {patient.insurance.bonusYears || 0}
                        </div>
                      </div>
                      {Object.keys(patient.befunde || {}).length > 0 && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          HKP Available
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-2">
                  {t('patients.notFound')}
                </p>
                <Button variant="link" className="text-primary">
                  {t('patients.createManually')}
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}