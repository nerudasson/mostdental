```typescript
import { useProductionStore } from '@/stores/production-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Clock, CheckCircle2, AlertCircle, Play, Pause, User } from 'lucide-react';
import { ProductionProgressTimeline } from './production-progress-timeline';
import { ProductionStepAssignment } from './production-step-assignment';
import { useAuth } from '@/hooks/use-auth';

interface ProductionUnitDetailsProps {
  unitId: string;
}

const statusStyles = {
  pending: {
    label: 'Ausstehend',
    icon: Clock,
    class: 'bg-yellow-100 text-yellow-800',
  },
  in_progress: {
    label: 'In Bearbeitung',
    icon: Play,
    class: 'bg-blue-100 text-blue-800',
  },
  completed: {
    label: 'Abgeschlossen',
    icon: CheckCircle2,
    class: 'bg-green-100 text-green-800',
  },
  on_hold: {
    label: 'Pausiert',
    icon: Pause,
    class: 'bg-orange-100 text-orange-800',
  },
};

export function ProductionUnitDetails({ unitId }: ProductionUnitDetailsProps) {
  const { user } = useAuth();
  const { productionUnits, productionLines } = useProductionStore();
  
  const unit = productionUnits.find(u => u.id === unitId);
  if (!unit) return null;

  const line = productionLines.find(l => l.id === unit.productionLineId);
  if (!line) return null;

  // Calculate progress
  const completedSteps = unit.steps.filter(s => s.status === 'completed').length;
  const totalSteps = unit.steps.length;
  const progress = Math.round((completedSteps / totalSteps) * 100);

  // Get current step details
  const currentStep = unit.steps.find(s => s.status === 'in_progress') || 
                     unit.steps.find(s => s.status === 'pending');
  const currentStepDetails = currentStep && 
    line.steps.find(s => s.id === currentStep.stepId);

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Produktionseinheit #{unit.id}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Auftrag #{unit.orderId}
              </p>
            </div>
            <Badge 
              variant="secondary" 
              className={statusStyles[unit.status].class}
            >
              {statusStyles[unit.status].label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  Gesamtfortschritt
                </span>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {currentStepDetails && (
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                <div>
                  <h4 className="font-medium">Aktueller Schritt</h4>
                  <p className="text-sm text-muted-foreground">
                    {currentStepDetails.name}
                  </p>
                </div>
                {currentStep?.assignedTechnicianId && (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-medium">Zugewiesen an</p>
                      <p className="text-muted-foreground">Techniker Name</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between text-sm">
              <div>
                <span className="text-muted-foreground">Gestartet</span>
                <p className="font-medium">
                  {unit.startedAt ? format(new Date(unit.startedAt), 'PPp') : '-'}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Geschätzte Fertigstellung</span>
                <p className="font-medium">
                  {format(new Date(unit.estimatedCompletionDate), 'PPp')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <ProductionProgressTimeline unit={unit} line={line} />

      {/* Step Assignment */}
      {user?.role === 'lab' && (
        <ProductionStepAssignment unit={unit} line={line} />
      )}
    </div>
  );
}
```