import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const belPositions = [
  { value: '001', label: 'Modell', category: 'BEL' },
  { value: '002', label: 'Bissregistrat', category: 'BEL' },
  { value: '101', label: 'Vollgusskrone', category: 'BEL' },
  { value: '201', label: 'Metallkeramikkrone', category: 'BEL' },
];

const bebPositions = [
  { value: '301', label: 'Individualisierung', category: 'BEB' },
  { value: '302', label: 'Speziallegierung', category: 'BEB' },
  { value: '303', label: 'Expressarbeit', category: 'BEB' },
];

export function PricingCard() {
  const { toast } = useToast();
  const [positions, setPositions] = useState<Array<{
    id: string;
    code: string;
    description: string;
    quantity: number;
    price: number;
  }>>([]);
  const [notes, setNotes] = useState('');
  const [deliveryDate, setDeliveryDate] = useState<Date>();

  const handleAddPosition = () => {
    setPositions([
      ...positions,
      {
        id: Math.random().toString(36).substr(2, 9),
        code: '',
        description: '',
        quantity: 1,
        price: 0,
      },
    ]);
  };

  const handleRemovePosition = (id: string) => {
    setPositions(positions.filter(p => p.id !== id));
  };

  const handleUpdatePosition = (id: string, field: string, value: any) => {
    setPositions(positions.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleApprove = () => {
    if (!deliveryDate) {
      toast({
        title: 'Missing information',
        description: 'Please select a delivery date',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Estimate approved',
      description: 'The estimate has been approved and sent to the dentist',
    });
  };

  const totalPrice = positions.reduce((sum, p) => sum + (p.price * p.quantity), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Positions and Pricing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            {positions.map((position) => (
              <div key={position.id} className="flex gap-4 items-start">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Select
                      value={position.code}
                      onValueChange={(value) => {
                        const selectedPosition = [...belPositions, ...bebPositions]
                          .find(p => p.value === value);
                        handleUpdatePosition(position.id, 'code', value);
                        handleUpdatePosition(position.id, 'description', selectedPosition?.label || '');
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="" disabled>Select position...</SelectItem>
                        <SelectItem value="bel" disabled className="font-semibold">
                          BEL Positions
                        </SelectItem>
                        {belPositions.map((pos) => (
                          <SelectItem key={pos.value} value={pos.value}>
                            {pos.value} - {pos.label}
                          </SelectItem>
                        ))}
                        <SelectItem value="beb" disabled className="font-semibold">
                          BEB Positions
                        </SelectItem>
                        {bebPositions.map((pos) => (
                          <SelectItem key={pos.value} value={pos.value}>
                            {pos.value} - {pos.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={position.description}
                      onChange={(e) => handleUpdatePosition(position.id, 'description', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={position.quantity}
                      onChange={(e) => handleUpdatePosition(position.id, 'quantity', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price (€)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={position.price}
                      onChange={(e) => handleUpdatePosition(position.id, 'price', parseFloat(e.target.value))}
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-8"
                  onClick={() => handleRemovePosition(position.id)}
                >
                  ×
                </Button>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full"
              onClick={handleAddPosition}
            >
              Add Position
            </Button>

            <div className="flex justify-end text-lg font-medium">
              Total: €{totalPrice.toFixed(2)}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Delivery Date</Label>
              <Calendar
                mode="single"
                selected={deliveryDate}
                onSelect={setDeliveryDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes or special requirements..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline">Save Draft</Button>
          <Button 
            onClick={handleApprove}
            disabled={positions.length === 0 || !deliveryDate}
          >
            Approve Estimate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}