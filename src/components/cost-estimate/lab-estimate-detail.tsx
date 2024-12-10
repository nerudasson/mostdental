import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HKPChart } from '@/components/dental-chart/hkp-chart';
import { useCostEstimateStore } from '@/stores/cost-estimates';
import { useToast } from '@/hooks/use-toast';
import { useNotificationStore } from '@/hooks/use-notifications';

interface LabEstimateDetailProps {
  id?: string;
}

export function LabEstimateDetail({ id }: LabEstimateDetailProps) {
  const { toast } = useToast();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const { getEstimate, updateEstimate } = useCostEstimateStore();
  const estimate = getEstimate(id || '');
  
  const [labFees, setLabFees] = useState(estimate?.labFees || 0);
  const [notes, setNotes] = useState(estimate?.notes || '');

  if (!estimate) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Estimate not found
      </div>
    );
  }

  const handleSubmitPrice = () => {
    if (!estimate) return;

    try {
      updateEstimate(estimate.id, {
        status: 'priced',
        labFees,
        notes,
      });

      // Notify dentist
      addNotification({
        type: 'estimate_priced',
        title: 'Cost Estimate Priced',
        description: `Lab fees: €${labFees.toFixed(2)}`,
        estimateId: estimate.id,
      });

      toast({
        title: 'Price submitted',
        description: 'The dentist will be notified of your pricing.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit pricing',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Cost Estimate #{id}</h1>
          <p className="text-sm text-muted-foreground">
            Created on {format(estimate.createdAt, 'PPP')}
          </p>
        </div>
        {estimate.status === 'pending_lab' && (
          <Button onClick={handleSubmitPrice}>
            Submit Price
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dentist Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Name</span>
                <p className="font-medium">{estimate.dentist.name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Practice</span>
                <p className="font-medium">{estimate.dentist.practice}</p>
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
          <CardTitle>Lab Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Lab Fees (€)</Label>
              <Input
                type="number"
                step="0.01"
                value={labFees}
                onChange={(e) => setLabFees(parseFloat(e.target.value))}
                disabled={estimate.status !== 'pending_lab'}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about materials, processing time, etc..."
                disabled={estimate.status !== 'pending_lab'}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}