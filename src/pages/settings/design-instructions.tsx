import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

interface DesignInstruction {
  id: string;
  indication: string;
  instructions: string;
}

const indications = [
  { value: 'crown', label: 'Crown (Krone)' },
  { value: 'bridge', label: 'Bridge (Brücke)' },
  { value: 'inlay', label: 'Inlay' },
  { value: 'onlay', label: 'Onlay' },
  { value: 'veneer', label: 'Veneer' },
  { value: 'partial_denture', label: 'Partial Denture (Teilprothese)' },
  { value: 'full_denture', label: 'Full Denture (Vollprothese)' },
  { value: 'implant', label: 'Implant (Implantat)' },
];

export function DesignInstructionsPage() {
  const { t } = useTranslation();
  const [instructions, setInstructions] = useState<DesignInstruction[]>([
    {
      id: '1',
      indication: 'crown',
      instructions: 'Natural appearance with slight translucency at the incisal edge. Match existing teeth color and morphology.',
    },
    {
      id: '2',
      indication: 'bridge',
      instructions: 'Ensure pontic has natural emergence profile. Maintain proper hygiene access.',
    },
  ]);
  const [selectedIndication, setSelectedIndication] = useState('');
  const [newInstructions, setNewInstructions] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = () => {
    if (editingId) {
      setInstructions(instructions.map(instruction => 
        instruction.id === editingId 
          ? { ...instruction, indication: selectedIndication, instructions: newInstructions }
          : instruction
      ));
      setEditingId(null);
    } else {
      setInstructions([
        ...instructions,
        {
          id: Math.random().toString(36).substr(2, 9),
          indication: selectedIndication,
          instructions: newInstructions,
        },
      ]);
    }
    setSelectedIndication('');
    setNewInstructions('');
    setShowDialog(false);
  };

  const handleEdit = (instruction: DesignInstruction) => {
    setSelectedIndication(instruction.indication);
    setNewInstructions(instruction.instructions);
    setEditingId(instruction.id);
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    setInstructions(instructions.filter(instruction => instruction.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Design Instructions</h1>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Instructions
        </Button>
      </div>

      <div className="grid gap-4">
        {instructions.map((instruction) => (
          <Card key={instruction.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">
                {indications.find(i => i.value === instruction.indication)?.label}
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEdit(instruction)}
                >
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDelete(instruction.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {instruction.instructions}
              </p>
            </CardContent>
          </Card>
        ))}

        {instructions.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-32">
              <p className="text-muted-foreground text-sm">No design instructions added yet.</p>
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => setShowDialog(true)}
              >
                Add your first instruction
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {editingId ? 'Edit Design Instructions' : 'Add Design Instructions'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Define your default design preferences for this indication.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Indication</Label>
              <Select
                value={selectedIndication}
                onValueChange={setSelectedIndication}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select indication..." />
                </SelectTrigger>
                <SelectContent>
                  {indications.map((indication) => (
                    <SelectItem 
                      key={indication.value} 
                      value={indication.value}
                      disabled={instructions.some(i => 
                        i.indication === indication.value && i.id !== editingId
                      )}
                    >
                      {indication.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Design Instructions</Label>
              <Textarea
                value={newInstructions}
                onChange={(e) => setNewInstructions(e.target.value)}
                placeholder="Enter your default design instructions for this indication..."
                className="min-h-[150px]"
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAdd}
              disabled={!selectedIndication || !newInstructions}
            >
              {editingId ? 'Save Changes' : 'Add Instructions'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}