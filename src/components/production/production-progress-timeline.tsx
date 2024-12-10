```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CheckCircle2, Clock, Play, Pause, AlertCircle } from 'lucide-react';
import type { ProductionUnit, ProductionLine } from '@/lib/types/production';

interface ProductionProgressTimelineProps {
  unit: ProductionUnit;
  line: ProductionLine;
}

const stepStatusStyles = {
  pending: {
    icon: Clock,
    class: 'bg-yellow-100 text-yellow-800',
    label: 'Ausstehend',
  },
  in_progress: {
    icon: Play,
    class: 'bg-blue-100 text-blue-800',
    label: 'In Bearbeitung',
  },
  completed: {
    icon: CheckCircle2,
    class: 'bg-green-100 text-green-800',
    label: 'Abgeschlossen',
  },
  on_hold: {
    icon: Pause,
    class: 'bg-orange-100 text-orange-800',
    label: 'Pausiert',
  },
};

export function ProductionProgressTimeline({ unit, line }: ProductionProgressTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Produktionsfortschritt</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-8">
            {unit.steps.map((step, index) => {
              const stepDetails = line.steps.find(s => s.id === step.stepId);
              if (!stepDetails) return null;

              const StatusIcon = stepStatusStyles[step.status].icon;

              return (
                <div key={step.id} className="relative flex gap-6">
                  {/* Status indicator */}
                  <div className={`
                    w-3 h-3 rounded-full mt-2
                    ${step.status === 'completed' ? 'bg-green-500' : 
                      step.status === 'in_progress' ? 'bg-blue-500' :
                      'bg-gray-300'}
                  `} />

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{stepDetails.name}</h4>
                        <Badge 
                          variant="secondary"
                          className={stepStatusStyles[step.status].class}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {stepStatusStyles[step.status].label}
                        </Badge>
                      </div>
                      {step.assignedTechnicianId && (
                        <span className="text-sm text-muted-foreground">
                          Techniker: {step.assignedTechnicianId}
                        </span>
                      )}
                    </div>

                    {step.status !== 'pending' && (
                      <div className="flex gap-6 text-sm text-muted-foreground">
                        <div>
                          <span>Gestartet: </span>
                          {step.startedAt && format(new Date(step.startedAt), 'PPp')}
                        </div>
                        {step.completedAt && (
                          <div>
                            <span>Abgeschlossen: </span>
                            {format(new Date(step.completedAt), 'PPp')}
                          </div>
                        )}
                      </div>
                    )}

                    {step.notes && (
                      <div className="text-sm mt-2 p-3 rounded-md bg-muted">
                        <AlertCircle className="h-4 w-4 inline-block mr-2 text-muted-foreground" />
                        {step.notes}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```