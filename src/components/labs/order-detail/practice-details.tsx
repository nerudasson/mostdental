import { Building, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Order } from '@/lib/orders/types';

interface PracticeDetailsProps {
  order: Order;
}

export function PracticeDetails({ order }: PracticeDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Practice Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{order.practice}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{order.dentistName}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>+49 123 456789</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}