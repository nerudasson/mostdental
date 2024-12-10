import { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMeditStore } from '@/hooks/use-medit';
import type { MeditScanner } from '@/lib/api/medit';

export function ScannerStatus() {
  const { api } = useMeditStore();
  const [scanners, setScanners] = useState<MeditScanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!api) return;

    const fetchScanners = async () => {
      try {
        const data = await api.getScanners();
        setScanners(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch scanner status');
      } finally {
        setLoading(false);
      }
    };

    fetchScanners();
    // Poll every 30 seconds
    const interval = setInterval(fetchScanners, 30000);
    return () => clearInterval(interval);
  }, [api]);

  if (!api) return null;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Scanner Status</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setScanners([])}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      <div className="mt-4 space-y-4">
        {scanners.map((scanner) => (
          <div 
            key={scanner.id}
            className="flex items-center justify-between p-2 rounded-lg bg-muted"
          >
            <div className="flex items-center gap-3">
              {scanner.status === 'online' ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-gray-400" />
              )}
              <div>
                <div className="font-medium">{scanner.name}</div>
                <div className="text-sm text-muted-foreground">
                  {scanner.model} • {scanner.serialNumber}
                </div>
              </div>
            </div>
            <Badge 
              variant={scanner.status === 'online' ? 'default' : 'secondary'}
              className={scanner.status === 'online' ? 'bg-green-100 text-green-800' : ''}
            >
              {scanner.status === 'online' ? 'Connected' : 'Offline'}
            </Badge>
          </div>
        ))}

        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </div>
    </Card>
  );
}