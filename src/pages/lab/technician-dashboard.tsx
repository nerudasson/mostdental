```typescript
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useProductionStore } from '@/stores/production-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CheckCircle2, AlertCircle, Play, Pause } from 'lucide-react';
import { format } from 'date-fns';

export function TechnicianDashboard() {
  const { user } = useAuth();
  const { productionUnits, completeStep } = useProductionStore();
  const [activeTab, setActiveTab] = useState('assigned');

  if (!user) return null;

  // Get units assigned to this technician
  const assignedUnits = productionUnits.filter(unit =>
    unit.steps.some(step => 
      step.assignedTechnicianId === user.id && 
      step.status === 'pending'
    )
  );

  // Get units in progress by this technician
  const inProgressUnits = productionUnits.filter(unit =>
    unit.steps.some(step => 
      step.assignedTechnicianId === user.id && 
      step.status === 'in_progress'
    )
  );

  // Get completed units by this technician
  const completedUnits = productionUnits.filter(unit =>
    unit.steps.some(step => 
      step.assignedTechnicianId === user.id && 
      step.status === 'completed'
    )
  );

  const handleStartStep = (unitId: string, stepId: string) => {
    // Update step status to in_progress
  };

  const handleCompleteStep = (unitId: string, stepId: string) => {
    completeStep({ unitId, stepId });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Techniker Dashboard</h1>
          <p className="text-muted-foreground">
            Willkommen zurück, {user.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Zugewiesene Aufgaben
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedUnits.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              In Bearbeitung
            </CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressUnits.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Abgeschlossen (heute)
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedUnits.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="assigned">
            Zugewiesen ({assignedUnits.length})
          </TabsTrigger>
          <TabsTrigger value="in_progress">
            In Bearbeitung ({inProgressUnits.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Abgeschlossen ({completedUnits.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="space-y-4">
          {assignedUnits.map(unit => (
            <Card key={unit.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">Auftrag #{unit.orderId}</h3>
                      <Badge variant="secondary">
                        Zugewiesen
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Fällig am {format(new Date(unit.startedAt!), 'PP')}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStartStep(unit.id, unit.currentStepId!)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Starten
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="in_progress" className="space-y-4">
          {inProgressUnits.map(unit => (
            <Card key={unit.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">Auftrag #{unit.orderId}</h3>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        In Bearbeitung
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Gestartet am {format(new Date(unit.startedAt!), 'PP')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCompleteStep(unit.id, unit.currentStepId!)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Abschließen
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedUnits.map(unit => (
            <Card key={unit.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">Auftrag #{unit.orderId}</h3>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Abgeschlossen
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Abgeschlossen am {format(new Date(unit.completedAt!), 'PP')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
```