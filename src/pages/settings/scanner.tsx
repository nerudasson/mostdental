import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Laptop, Wifi, RefreshCw, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface Scanner {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  ipAddress: string;
  status: 'connected' | 'disconnected' | 'error';
  autoConnect: boolean;
}

const scannerModels = [
  { value: 'itero', label: 'iTero', manufacturer: 'Align Technology' },
  { value: 'trios', label: 'TRIOS', manufacturer: '3Shape' },
  { value: 'primescan', label: 'Primescan', manufacturer: 'Dentsply Sirona' },
  { value: 'medit', label: 'Medit i500', manufacturer: 'Medit' },
  { value: 'cs3700', label: 'CS 3700', manufacturer: 'Carestream' },
];

const statusStyles = {
  connected: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  disconnected: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
};

export function ScannerSettingsPage() {
  const { t } = useTranslation();
  const [scanners, setScanners] = useState<Scanner[]>([
    {
      id: '1',
      name: 'Main Scanner',
      model: 'trios',
      serialNumber: 'TR789012',
      ipAddress: '192.168.1.100',
      status: 'connected',
      autoConnect: true,
    },
  ]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    serialNumber: '',
    ipAddress: '',
    autoConnect: true,
  });

  const handleAdd = () => {
    if (editingId) {
      setScanners(scanners.map(scanner => 
        scanner.id === editingId 
          ? { 
              ...scanner,
              name: formData.name,
              model: formData.model,
              serialNumber: formData.serialNumber,
              ipAddress: formData.ipAddress,
              autoConnect: formData.autoConnect,
            }
          : scanner
      ));
      setEditingId(null);
    } else {
      setScanners([
        ...scanners,
        {
          ...formData,
          id: Math.random().toString(36).substr(2, 9),
          status: 'disconnected',
        },
      ]);
    }
    setFormData({
      name: '',
      model: '',
      serialNumber: '',
      ipAddress: '',
      autoConnect: true,
    });
    setShowDialog(false);
  };

  const handleEdit = (scanner: Scanner) => {
    setFormData({
      name: scanner.name,
      model: scanner.model,
      serialNumber: scanner.serialNumber,
      ipAddress: scanner.ipAddress,
      autoConnect: scanner.autoConnect,
    });
    setEditingId(scanner.id);
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    setScanners(scanners.filter(scanner => scanner.id !== id));
  };

  const handleConnect = (id: string) => {
    setScanners(scanners.map(scanner =>
      scanner.id === id
        ? { ...scanner, status: 'connected' }
        : scanner
    ));
  };

  const handleAutoConnectToggle = (id: string) => {
    setScanners(scanners.map(scanner =>
      scanner.id === id
        ? { ...scanner, autoConnect: !scanner.autoConnect }
        : scanner
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Scanner Settings</h1>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Scanner
        </Button>
      </div>

      <div className="grid gap-4">
        {scanners.map((scanner) => (
          <Card key={scanner.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">
                    {scanner.name}
                  </CardTitle>
                  <Badge variant="secondary" className={statusStyles[scanner.status]}>
                    {scanner.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {scanner.status !== 'connected' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConnect(scanner.id)}
                    >
                      <Wifi className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(scanner)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(scanner.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Model</Label>
                  <p className="text-sm">
                    {scannerModels.find(m => m.value === scanner.model)?.label}
                    <span className="text-muted-foreground ml-2">
                      ({scannerModels.find(m => m.value === scanner.model)?.manufacturer})
                    </span>
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Serial Number</Label>
                  <p className="text-sm">{scanner.serialNumber}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">IP Address</Label>
                  <p className="text-sm">{scanner.ipAddress}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Auto Connect</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={scanner.autoConnect}
                      onCheckedChange={() => handleAutoConnectToggle(scanner.id)}
                    />
                    <Label className="text-sm">
                      {scanner.autoConnect ? 'Enabled' : 'Disabled'}
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {scanners.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-32">
              <p className="text-muted-foreground text-sm">
                No scanners configured yet.
              </p>
              <Button
                variant="link"
                className="mt-2"
                onClick={() => setShowDialog(true)}
              >
                Add your first scanner
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {editingId ? 'Edit Scanner' : 'Add Scanner'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Configure your intraoral scanner connection settings.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Scanner Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Main Scanner"
              />
            </div>

            <div className="space-y-2">
              <Label>Model</Label>
              <Select
                value={formData.model}
                onValueChange={(value) => setFormData({ ...formData, model: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select scanner model..." />
                </SelectTrigger>
                <SelectContent>
                  {scannerModels.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label} - {model.manufacturer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Serial Number</Label>
              <Input
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                placeholder="Enter scanner serial number"
              />
            </div>

            <div className="space-y-2">
              <Label>IP Address</Label>
              <Input
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                placeholder="e.g., 192.168.1.100"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.autoConnect}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, autoConnect: checked })
                }
              />
              <Label>Auto-connect when available</Label>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAdd}
              disabled={!formData.name || !formData.model || !formData.ipAddress}
            >
              {editingId ? 'Save Changes' : 'Add Scanner'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}