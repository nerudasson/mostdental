import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';

interface InsuranceCheckProps {
  patientCosts: number;
}

export function InsuranceCheck({ patientCosts }: InsuranceCheckProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const mockInsurances = [
    {
      name: 'DKV Zahnzusatz Premium',
      coverage: 90,
      monthlyRate: 45.80,
      waitingPeriod: 8,
      maxAnnual: 5000,
    },
    {
      name: 'Allianz Dental Best',
      coverage: 85,
      monthlyRate: 39.90,
      waitingPeriod: 6,
      maxAnnual: 4000,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Versicherung suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-4">
        {mockInsurances.map((insurance) => (
          <Card key={insurance.name} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{insurance.name}</h4>
                <div className="text-sm text-muted-foreground mt-1">
                  {insurance.coverage}% Erstattung • Max. {insurance.maxAnnual}€/Jahr
                </div>
                <div className="text-sm text-muted-foreground">
                  {insurance.waitingPeriod} Monate Wartezeit
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">
                  €{insurance.monthlyRate}/Monat
                </div>
                <div className="text-sm text-muted-foreground">
                  Ersparnis: €{((patientCosts * insurance.coverage) / 100).toFixed(2)}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}