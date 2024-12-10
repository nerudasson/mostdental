import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HKPChart } from '@/components/dental-chart/hkp-chart';

interface TreatmentPlanCardProps {
  treatment: {
    befunde: Record<string, string>;
    regelversorgung: Record<string, string>;
    therapie: Record<string, string>;
  };
}

export function TreatmentPlanCard({ treatment }: TreatmentPlanCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Treatment Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <HKPChart
          befunde={treatment.befunde}
          regelversorgung={treatment.regelversorgung}
          therapie={treatment.therapie}
        />
      </CardContent>
    </Card>
  );
}