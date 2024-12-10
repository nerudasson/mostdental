```typescript
import { useState } from 'react';
import { Plus, X, Settings2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useProductionStore } from '@/stores/production-store';
import { ProductionStepType, IndicationType } from '@/lib/types/production';

export function ProductionLinesPage() {
  const { productionLines, addProductionLine, updateProductionLine, deleteProductionLine } = useProductionStore();
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    indications: [] as IndicationType[],
    steps: [] as {
      id: string;
      name: string;
      type: ProductionStepType;
      duration: number;
      requiresTechnician: boolean;
      autoAssign: boolean;
    }[],
    isDefault: false,
    autoAssignEnabled: false,
  });

  const handleAddStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          id: crypto.randomUUID(),
          name: '',
          type: ProductionStepType.DESIGN,
          duration: 60,
          requiresTechnician: true,
          autoAssign: false,
        },
      ],
    }));
  };

  const handleRemoveStep = (stepId: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId),
    }));
  };

  const handleSubmit = () => {
    if (editingId) {
      updateProductionLine(editingId, formData);
    } else {
      addProductionLine(formData);
    }
    setShowDialog(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      indications: [],
      steps: [],
      isDefault: false,
      autoAssignEnabled: false,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Produktionslinien</h1>
          <p className="text-muted-foreground">
            Definieren Sie Produktionsabläufe für verschiedene Indikationen
          </p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Produktionslinie hinzufügen
        </Button>
      </div>

      <div className="grid gap-4">
        {productionLines.map((line) => (
          <Card key={line.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>{line.name}</CardTitle>
                  {line.description && (
                    <p className="text-sm text-muted-foreground">
                      {line.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData(line);
                      setEditingId(line.id);
                      setShowDialog(true);
                    }}
                  >
                    Bearbeiten
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteProductionLine(line.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {line.indications.map((indication) => (
                    <Badge key={indication} variant="secondary">
                      {indication}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2">
                  {line.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Settings2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{step.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {step.duration} min
                        </div>
                        {step.requiresTechnician && (
                          <Badge variant="secondary">
                            Techniker erforderlich
                          </Badge>
                        )}
                        {step.autoAssign && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Auto-Zuweisung
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Schritt {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {editingId ? 'Produktionslinie bearbeiten' : 'Neue Produktionslinie'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Definieren Sie die Schritte und Einstellungen für diese Produktionslinie.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="z.B. Standard Kronen Produktion"
                />
              </div>

              <div className="space-y-2">
                <Label>Beschreibung</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optionale Beschreibung..."
                />
              </div>

              <div className="space-y-2">
                <Label>Indikationen</Label>
                <Select
                  value={formData.indications[0]}
                  onValueChange={(value) =>
                    setFormData({ ...formData, indications: [value as IndicationType] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Indikation auswählen..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(IndicationType).map((indication) => (
                      <SelectItem key={indication} value={indication}>
                        {indication}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Produktionsschritte</Label>
                  <Button variant="outline" size="sm" onClick={handleAddStep}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schritt hinzufügen
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="grid grid-cols-12 gap-4 items-start border p-4 rounded-lg"
                    >
                      <div className="col-span-3 space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={step.name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              steps: formData.steps.map((s) =>
                                s.id === step.id
                                  ? { ...s, name: e.target.value }
                                  : s
                              ),
                            })
                          }
                          placeholder="Schritt Name"
                        />
                      </div>

                      <div className="col-span-3 space-y-2">
                        <Label>Typ</Label>
                        <Select
                          value={step.type}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              steps: formData.steps.map((s) =>
                                s.id === step.id
                                  ? { ...s, type: value as ProductionStepType }
                                  : s
                              ),
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(ProductionStepType).map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="col-span-2 space-y-2">
                        <Label>Dauer (min)</Label>
                        <Input
                          type="number"
                          min="1"
                          value={step.duration}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              steps: formData.steps.map((s) =>
                                s.id === step.id
                                  ? { ...s, duration: parseInt(e.target.value) }
                                  : s
                              ),
                            })
                          }
                        />
                      </div>

                      <div className="col-span-3 space-y-2">
                        <Label>Einstellungen</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={step.requiresTechnician}
                              onCheckedChange={(checked) =>
                                setFormData({
                                  ...formData,
                                  steps: formData.steps.map((s) =>
                                    s.id === step.id
                                      ? { ...s, requiresTechnician: checked }
                                      : s
                                  ),
                                })
                              }
                            />
                            <Label>Techniker erforderlich</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={step.autoAssign}
                              onCheckedChange={(checked) =>
                                setFormData({
                                  ...formData,
                                  steps: formData.steps.map((s) =>
                                    s.id === step.id
                                      ? { ...s, autoAssign: checked }
                                      : s
                                  ),
                                })
                              }
                            />
                            <Label>Auto-Zuweisung</Label>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveStep(step.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isDefault}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isDefault: checked })
                  }
                />
                <Label>Als Standard für ausgewählte Indikationen festlegen</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.autoAssignEnabled}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, autoAssignEnabled: checked })
                  }
                />
                <Label>Auto-Zuweisung für diese Linie aktivieren</Label>
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              disabled={!formData.name || formData.steps.length === 0}
            >
              {editingId ? 'Speichern' : 'Erstellen'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
```