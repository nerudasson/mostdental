import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Eye, Download, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMeditStore } from '@/hooks/use-medit';
import type { MeditScan } from '@/lib/api/medit';

interface ScanListProps {
  patientId: string;
  onScanSelect?: (scan: MeditScan) => void;
}

export function ScanList({ patientId, onScanSelect }: ScanListProps) {
  const { api } = useMeditStore();
  const [scans, setScans] = useState<MeditScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (!api || !patientId) return;

    const fetchScans = async () => {
      try {
        const data = await api.getScans(patientId);
        setScans(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch scans');
      } finally {
        setLoading(false);
      }
    };

    fetchScans();
  }, [api, patientId]);

  const handleDownload = async (scan: MeditScan) => {
    if (!api) return;

    setDownloading(scan.id);
    try {
      // Download all files for this scan
      for (const file of scan.files) {
        const blob = await api.downloadScan(scan.id, file.id);
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError('Failed to download scan');
    } finally {
      setDownloading(null);
    }
  };

  if (!api) return null;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Patient Scans</h3>
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading scans...
          </div>
        )}
      </div>

      <div className="space-y-4">
        {scans.map((scan) => (
          <div 
            key={scan.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted"
          >
            <div>
              <div className="font-medium">{scan.type}</div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(scan.createdAt), 'PPp')}
              </div>
              <div className="text-sm text-muted-foreground">
                {scan.files.length} files
              </div>
            </div>
            <div className="flex gap-2">
              {onScanSelect && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onScanSelect(scan)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(scan)}
                disabled={downloading === scan.id}
              >
                {downloading === scan.id ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <Download className="h-4 w-4 mr-1" />
                )}
                Download
              </Button>
            </div>
          </div>
        ))}

        {!loading && scans.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            No scans found for this patient
          </div>
        )}

        {error && (
          <div className="text-sm text-destructive">
            {error}
          </div>
        )}
      </div>
    </Card>
  );
}