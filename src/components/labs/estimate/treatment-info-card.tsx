import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TreatmentInfoCardProps {
  patient: {
    id: string;
    name: string;
  };
  treatment: {
    type: string;
    description: string;
    notes: string;
  };
}

export function TreatmentInfoCard({ patient, treatment }: TreatmentInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Treatment Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="text-sm text-muted-foreground">Patient</span>
            <p className="font-medium">{patient.name}</p>
            <p className="text-sm text-muted-foreground">{patient.id}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Treatment</span>
            <p className="font-medium">{treatment.type}</p>
            <p className="text-sm">{treatment.description}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Notes</span>
            <p className="text-sm">{treatment.notes}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}