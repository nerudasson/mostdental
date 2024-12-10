```typescript
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProductionStore } from '@/stores/production-store';
import type { ProductionUnit, ProductionLine } from '@/lib/types/production';

interface ProductionStepAssignmentProps {
  unit: ProductionUnit;
  line: ProductionLine;
}

// Mock technicians data - in real app, get from team store
const mockTechnicians = [
  { id: 'tech1', name: 'Anna Schmidt', specialization: 'ceramics' },
  { id: 'tech2', name: 'Max Weber', specialization: 'cad_cam' },
  { id: 'tech3', name: 'Lisa Müller', specialization: 'crown_bridge' },
];

export function ProductionStepAssignment({ unit, line }: ProductionStepAssignmentProps) {
  const { assignTechnician } = useProductionStore();
  const [selectedTechnicians, setSelectedTechnicians] = useState<Record<string, string>>(
    Object.fromEntries(
      unit.steps
        .filter(step => step.assignedTechnicianId)
        .map(step => [step.stepId, step.assignedTechnicianId!])
    )
  );

  const handleAssign = (stepId: string, technicianId: string) => {
    setSelectedTechnicians(prev => ({
      ...prev,
      [stepId]: technicianId,
    }));
    assignTechnician({
      unitId: unit.id,
      stepId,
      technicianId,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Techniker Zuweisung</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {unit.steps.map((step) => {
            const stepDetails = line.steps.find(s => s.id === step.stepId);
            if (!stepDetails?.requiresTechnician) return null;

            return (
              <div
                key={step.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <h4 className="font-medium">{stepDetails.name}</h4>
                  <div className="flex gap-2 mt-1">
                    {step.status === 'completed' ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Abgeschlossen
                      </Badge>
                    ) : step.assignedTechnicianId ? (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Zugewiesen
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        Nicht zugewiesen
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    value={selectedTechnicians[step.stepId] || ''}
                    onValueChange={(value) => handleAssign(step.stepId, value)}
                    disabled={step.status === 'completed'}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Techniker auswählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTechnicians.map((tech) => (
                        <SelectItem key={tech.id} value={tech.id}>
                          {tech.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {step.assignedTechnicianId && step.status !== 'completed' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAssign(step.stepId, '')}
                    >
                      Entfernen
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
```