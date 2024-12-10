import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ModelViewer } from './stl-viewer';
import { useOrderScans } from '@/hooks/use-order-scans';
import { FileText, View, Download, Loader2, Play } from 'lucide-react';

interface OrderScansProps {
  orderId: string;
}

export function OrderScans({ orderId }: OrderScansProps) {
  const { scans, loading, error, processScan } = useOrderScans(orderId);
  const [selectedScanIndex, setSelectedScanIndex] = useState<number | null>(null);
  const [processing, setProcessing] = useState<string[]>([]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground">
        <p>{error}</p>
      </div>
    );
  }

  if (scans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground">
        <p>No scans available</p>
      </div>
    );
  }

  const selectedScan = selectedScanIndex !== null ? scans[selectedScanIndex] : null;
  const stlFile = selectedScan?.files.find(f => f.name.toLowerCase().endsWith('.stl'));

  const handleProcess = async (scanId: string) => {
    setProcessing(prev => [...prev, scanId]);
    try {
      await processScan(scanId);
    } finally {
      setProcessing(prev => prev.filter(id => id !== scanId));
    }
  };

  return (
    <div className="space-y-4">
      {/* STL Viewer */}
      {selectedScan && (
        <ModelViewer 
          url={stlFile?.url} 
          onClose={() => setSelectedScanIndex(null)} 
        />
      )}

      {/* Scan List */}
      <div className="grid gap-4">
        {scans.map((scan, index) => (
          <Card key={scan.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">
                      Scan {index + 1}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {scan.files.length} files • {scan.scannerType}
                    </p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={
                      scan.status === 'processed' ? 'bg-green-100 text-green-800' :
                      scan.status === 'error' ? 'bg-red-100 text-red-800' :
                      scan.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedScanIndex(index)}
                  >
                    <View className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  {scan.status === 'matched' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleProcess(scan.id)}
                      disabled={processing.includes(scan.id)}
                    >
                      {processing.includes(scan.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <Play className="h-4 w-4 mr-1" />
                      )}
                      Process
                    </Button>
                  )}
                </div>
              </div>
              {scan.error && (
                <p className="text-sm text-destructive mt-2">
                  Error: {scan.error}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}