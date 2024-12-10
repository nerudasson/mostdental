import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface Position {
  id: string;
  code: string;
  description: string;
  quantity: number;
  price: number;
}

const mockEstimate = {
  id: 'LCE001',
  dentist: {
    name: 'Dr. Smith',
    practice: 'Smith Dental',
    email: 'dr.smith@example.com',
    phone: '+49 123 456789',
    address: 'Dental Street 123, 12345 City',
  },
  patient: {
    id: '#3454',
    name: 'Jack Smile',
  },
  treatment: {
    type: 'Bridge Metal',
    description: 'Bridge 13-15',
    teeth: ['13', '14', '15'],
    notes: 'Patient prefers metal over ceramic due to cost considerations',
  },
  requestedDate: new Date('2024-02-20'),
  status: 'pending',
};

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

export function LabEstimateDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [positions, setPositions] = useState<Position[]>([]);
  const [notes, setNotes] = useState('');
  const [deliveryDate, setDeliveryDate] = useState<Date>();

  const handleAddPosition = () => {
    const newPosition: Position = {
      id: Math.random().toString(36).substr(2, 9),
      code: '',
      description: '',
      quantity: 1,
      price: 0,
    };
    setPositions([...positions, newPosition]);
  };

  const handleRemovePosition = (id: string) => {
    setPositions(positions.filter(p => p.id !== id));
  };

  const handleUpdatePosition = (id: string, field: keyof Position, value: any) => {
    setPositions(positions.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleApprove = () => {
    // Here you would submit the approval with positions and delivery date
    console.log('Approving estimate:', { positions, notes, deliveryDate });
  };

  const totalPrice = positions.reduce((sum, p) => sum + (p.price * p.quantity), 0);

  return (
    <div className="space-y-6">
      {/* Header section remains the same */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Cost Estimate {mockEstimate.id}</h1>
            <p className="text-sm text-muted-foreground">
              Requested on {format(mockEstimate.requestedDate, 'PPP')}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Dentist and Treatment info cards remain the same */}
      <div className="grid grid-cols-2 gap-6">
        {/* Previous cards remain unchanged */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Positions and Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-8 gap-2 mb-6">
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded border ${
                    mockEstimate.treatment.teeth.includes((i + 1).toString())
                      ? 'bg-primary/20'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <div className="space-y-4">
              {positions.map((position) => (
                <div key={position.id} className="flex gap-4 items-start">
                  <div className="flex-1 grid grid-cols-5 gap-4">
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
                    <div className="col-span-2 space-y-2">
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
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                variant="outline"
                className="w-full"
                onClick={handleAddPosition}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Position
              </Button>

              <div className="flex justify-end text-lg font-medium">
                Total: €{totalPrice.toFixed(2)}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Delivery Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-[240px] justify-start text-left font-normal',
                        !deliveryDate && 'text-muted-foreground'
                      )}
                    >
                      {deliveryDate ? format(deliveryDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={deliveryDate}
                      onSelect={setDeliveryDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
    </div>
  );
}