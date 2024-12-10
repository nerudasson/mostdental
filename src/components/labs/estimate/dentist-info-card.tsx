import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DentistInfoCardProps {
  dentist: {
    name: string;
    practice: string;
    email: string;
    phone: string;
    address: string;
  };
}

export function DentistInfoCard({ dentist }: DentistInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dentist Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="text-sm text-muted-foreground">Name</span>
            <p className="font-medium">{dentist.name}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Practice</span>
            <p className="font-medium">{dentist.practice}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Contact</span>
            <p className="font-medium">{dentist.email}</p>
            <p className="font-medium">{dentist.phone}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Address</span>
            <p className="font-medium">{dentist.address}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}