import { format } from 'date-fns';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2,
  AlertCircle,
  FolderOpen
} from 'lucide-react';
import { useScanVault } from '@/lib/scan-vault/store';

export function ProcessingHistory() {
  const { scans } = useScanVault();
  const processedScans = scans.filter(scan => 
    scan.status === 'processed' || scan.status === 'error'
  );

  const handleOpenLocation = (location: string) => {
    // In a real app, this would open the file location
    console.log('Opening location:', location);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Processing History</h2>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Processed At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedScans.map((scan) => (
              <TableRow key={scan.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{scan.patientName}</div>
                    <div className="text-sm text-muted-foreground">
                      {scan.patientId}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{scan.matchedOrderId}</TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className={scan.status === 'processed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    }
                  >
                    {scan.status === 'processed' ? (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    )}
                    {scan.status === 'processed' ? 'Processed' : 'Failed'}
                  </Badge>
                  {scan.processingError && (
                    <p className="text-xs text-destructive mt-1">
                      {scan.processingError}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(), 'PPp')}
                </TableCell>
                <TableCell>
                  {scan.status === 'processed' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenLocation(scan.id)}
                    >
                      <FolderOpen className="h-4 w-4 mr-1" />
                      Open Location
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {processedScans.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <p className="text-muted-foreground">No processing history</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}