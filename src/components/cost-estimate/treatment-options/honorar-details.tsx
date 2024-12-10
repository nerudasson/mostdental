import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { TreatmentPlan, Position } from '@/lib/cost-estimation/types';

interface HonorarDetailsProps {
  treatmentPlan: TreatmentPlan;
  gozFactor: number;
  onGozFactorChange: (factor: number) => void;
  onPositionsChange?: (positions: Position[]) => void;
}

const BEMA_POINT_VALUE = 1.0;
const GOZ_POINT_VALUE = 1.2;

// Available positions for adding
const AVAILABLE_POSITIONS = {
  BEMA: {
    '89': { code: '89', points: 4, description: 'Abformung', type: 'BEMA' },
    '91b': { code: '91b', points: 3, description: 'Bissregistrierung', type: 'BEMA' },
    '98a': { code: '98a', points: 7, description: 'Einprobe', type: 'BEMA' },
    '98d': { code: '98d', points: 9, description: 'Eingliederung', type: 'BEMA' },
  },
  GOZ: {
    '2197': { code: '2197', points: 7, description: 'Adhäsive Befestigung', type: 'GOZ' },
    '5070': { code: '5070', points: 13, description: 'Präparation', type: 'GOZ' },
    '5040': { code: '5040', points: 20, description: 'Vollkrone', type: 'GOZ' },
    '5120': { code: '5120', points: 24, description: 'Brückenglied', type: 'GOZ' },
  },
} as const;

export function HonorarDetails({
  treatmentPlan,
  gozFactor,
  onGozFactorChange,
  onPositionsChange,
}: HonorarDetailsProps) {
  const [positions, setPositions] = useState<Position[]>(treatmentPlan.costs.positions);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newPosition, setNewPosition] = useState({
    type: 'BEMA' as const,
    code: '',
  });

  // Calculate position amounts and totals
  const { positionAmounts, totalBema, totalGoz } = useMemo(() => {
    const amounts: Record<string, number> = {};
    let bemaTotal = 0;
    let gozTotal = 0;

    positions.forEach((pos) => {
      const amount = pos.points * (pos.type === 'BEMA' ? BEMA_POINT_VALUE : GOZ_POINT_VALUE * gozFactor);
      amounts[pos.code] = amount;

      if (pos.type === 'BEMA') {
        bemaTotal += amount;
      } else {
        gozTotal += amount;
      }
    });

    return {
      positionAmounts: amounts,
      totalBema: bemaTotal,
      totalGoz: gozTotal,
    };
  }, [positions, gozFactor]);

  const handleFactorChange = (code: string, factor: number) => {
    if (factor >= 1 && factor <= 3.5) {
      onGozFactorChange(factor);
    }
  };

  const handleAddPosition = () => {
    const positionData = newPosition.type === 'BEMA' 
      ? AVAILABLE_POSITIONS.BEMA[newPosition.code as keyof typeof AVAILABLE_POSITIONS.BEMA]
      : AVAILABLE_POSITIONS.GOZ[newPosition.code as keyof typeof AVAILABLE_POSITIONS.GOZ];

    if (positionData) {
      const updatedPositions = [...positions, positionData];
      setPositions(updatedPositions);
      onPositionsChange?.(updatedPositions);
      setShowAddDialog(false);
      setNewPosition({ type: 'BEMA', code: '' });
    }
  };

  const handleDeletePosition = (code: string) => {
    const updatedPositions = positions.filter(pos => pos.code !== code);
    setPositions(updatedPositions);
    onPositionsChange?.(updatedPositions);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Positionen</h3>
        <Button size="sm" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Position hinzufügen
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Beschreibung</TableHead>
            <TableHead>Punkte</TableHead>
            <TableHead>Faktor</TableHead>
            <TableHead className="text-right">Betrag</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.map((pos) => (
            <TableRow key={pos.code}>
              <TableCell className="font-medium">{pos.code}</TableCell>
              <TableCell>{pos.description}</TableCell>
              <TableCell>{pos.points}</TableCell>
              <TableCell>
                {pos.type === 'GOZ' ? (
                  <Input
                    type="number"
                    value={gozFactor}
                    onChange={(e) => handleFactorChange(pos.code, parseFloat(e.target.value))}
                    className="w-20"
                    step="0.1"
                    min="1"
                    max="3.5"
                  />
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell className="text-right">
                €{positionAmounts[pos.code].toFixed(2)}
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDeletePosition(pos.code)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="space-y-4 pt-4 border-t">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">BEMA Gesamt</div>
          <div className="font-medium">€{totalBema.toFixed(2)}</div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">GOZ Gesamt</div>
          <div className="font-medium">€{totalGoz.toFixed(2)}</div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t">
          <div>
            <div className="font-medium">Gesamt</div>
            <div className="text-sm text-muted-foreground">BEMA + GOZ</div>
          </div>
          <div className="text-xl font-bold">
            €{(totalBema + totalGoz).toFixed(2)}
          </div>
        </div>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Position hinzufügen</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Typ</label>
              <Select
                value={newPosition.type}
                onValueChange={(value: 'BEMA' | 'GOZ') => 
                  setNewPosition({ type: value, code: '' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEMA">BEMA</SelectItem>
                  <SelectItem value="GOZ">GOZ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Position</label>
              <Select
                value={newPosition.code}
                onValueChange={(value) => 
                  setNewPosition({ ...newPosition, code: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Position auswählen..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(
                    newPosition.type === 'BEMA' 
                      ? AVAILABLE_POSITIONS.BEMA 
                      : AVAILABLE_POSITIONS.GOZ
                  ).map((pos) => (
                    <SelectItem key={pos.code} value={pos.code}>
                      {pos.code} - {pos.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleAddPosition} disabled={!newPosition.code}>
              Hinzufügen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}