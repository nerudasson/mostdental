import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HKPChart } from '@/components/dental-chart/hkp-chart';
import { CreateOrderDialog } from '@/components/orders/create-order-dialog';
import { useCostEstimateStore } from '@/stores/cost-estimates';

interface DentistEstimateDetailProps {
  id?: string;
}

export function DentistEstimateDetail({ id }: DentistEstimateDetailProps) {
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const { getEstimate } = useCostEstimateStore();
  const estimate = getEstimate(id || '');

  if (!estimate) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Estimate not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Cost Estimate #{id}</h1>
          <p className="text-sm text-muted-foreground">
            Created on {format(estimate.createdAt, 'PPP')}
          </p>
        </div>
        {estimate.status === 'priced' && (
          <Button onClick={() => setShowOrderDialog(true)}>
            <Package2 className="h-4 w-4 mr-2" />
            Create Order
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lab Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Name</span>
                <p className="font-medium">{estimate.lab?.name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className="ml-2">
                  {estimate.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Name</span>
                <p className="font-medium">{estimate.patient.name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">ID</span>
                <p className="font-medium">{estimate.patient.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Treatment Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <span className="text-sm text-muted-foreground">Type</span>
              <p className="font-medium">{estimate.treatment.type}</p>
              <p className="text-sm">{estimate.treatment.description}</p>
            </div>

            <HKPChart
              befunde={estimate.treatment.befunde}
              regelversorgung={estimate.treatment.regelversorgung}
              therapie={estimate.treatment.therapie}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Total Cost</span>
              <p className="text-2xl font-bold">€{estimate.totalCost?.toFixed(2)}</p>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Lab Fees</span>
              <p className="text-2xl font-bold">€{estimate.labFees?.toFixed(2)}</p>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Patient Portion</span>
              <p className="text-2xl font-bold">€{estimate.patientPortion?.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {estimate.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{estimate.notes}</p>
          </CardContent>
        </Card>
      )}

      {showOrderDialog && (
        <CreateOrderDialog
          open={showOrderDialog}
          onOpenChange={setShowOrderDialog}
          estimate={estimate}
        />
      )}
    </div>
  );
}