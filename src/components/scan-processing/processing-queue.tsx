import { useState } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Clock, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Play,
  Trash2
} from 'lucide-react';

interface QueuedScan {
  id: string;
  patientName: string;
  patientId: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  processingError?: string;
}

const mockScans: QueuedScan[] = [
  {
    id: '1',
    patientName: 'John Doe',
    patientId: 'P001',
    status: 'pending'
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    patientId: 'P002',
    status: 'processing'
  }
];

const statusConfig = {
  pending: {
    label: 'Pending',
    Icon: Clock,
    class: 'bg-yellow-100 text-yellow-800',
  },
  processing: {
    label: 'Processing',
    Icon: Loader2,
    class: 'bg-blue-100 text-blue-800',
  },
  completed: {
    label: 'Completed',
    Icon: CheckCircle2,
    class: 'bg-green-100 text-green-800',
  },
  error: {
    label: 'Error',
    Icon: AlertCircle,
    class: 'bg-red-100 text-red-800',
  },
};

export function ProcessingQueue() {
  const [queuedScans] = useState<QueuedScan[]>(mockScans);

  // Mobile card view
  const renderMobileCard = (scan: QueuedScan) => {
    const { Icon, label, class: className } = statusConfig[scan.status];
    
    return (
      <Card key={scan.id} className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium">{scan.patientName}</div>
            <div className="text-sm text-muted-foreground">{scan.patientId}</div>
          </div>
          <Badge variant="secondary" className={className}>
            <Icon className="h-3 w-3 mr-1" />
            {label}
          </Badge>
        </div>

        {scan.processingError && (
          <p className="text-sm text-destructive mt-1">
            {scan.processingError}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t">
          {scan.status === 'pending' && (
            <Button variant="ghost" size="sm">
              <Play className="h-4 w-4 mr-1" />
              Process
            </Button>
          )}
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-semibold">Processing Queue</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Play className="h-4 w-4 mr-2" />
            Process All
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Queue
          </Button>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queuedScans.map((scan) => {
              const { Icon, label, class: className } = statusConfig[scan.status];
              
              return (
                <TableRow key={scan.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{scan.patientName}</div>
                      <div className="text-sm text-muted-foreground">
                        {scan.patientId}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={className}>
                      <Icon className="h-3 w-3 mr-1" />
                      {label}
                    </Badge>
                    {scan.processingError && (
                      <p className="text-xs text-destructive mt-1">
                        {scan.processingError}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {scan.status === 'pending' && (
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4 mr-1" />
                          Process
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {queuedScans.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  <p className="text-muted-foreground">Processing queue is empty</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {queuedScans.map(renderMobileCard)}
        {queuedScans.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Processing queue is empty
          </div>
        )}
      </div>
    </div>
  );
}