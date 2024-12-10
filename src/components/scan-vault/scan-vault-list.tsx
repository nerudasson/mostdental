import { useState } from 'react';
import { format } from 'date-fns';
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
import { Input } from '@/components/ui/input';
import { 
  Download, 
  Link as LinkIcon, 
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';
import { useScanVault } from '@/lib/scan-vault/store';
import { VaultedScan } from '@/lib/scan-vault/types';

const statusStyles = {
  pending: {
    label: 'Pending',
    icon: Clock,
    class: 'bg-yellow-100 text-yellow-800'
  },
  matched: {
    label: 'Matched',
    icon: LinkIcon,
    class: 'bg-blue-100 text-blue-800'
  },
  processed: {
    label: 'Processed',
    icon: CheckCircle,
    class: 'bg-green-100 text-green-800'
  },
  error: {
    label: 'Error',
    icon: AlertCircle,
    class: 'bg-red-100 text-red-800'
  }
};

export function ScanVaultList() {
  const { scans } = useScanVault();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredScans = scans.filter(scan => 
    scan.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scan.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scan.dentistName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search scans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Dentist</TableHead>
              <TableHead>Files</TableHead>
              <TableHead>Received</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredScans.map((scan) => (
              <ScanRow key={scan.id} scan={scan} />
            ))}
            {filteredScans.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">No scans found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ScanRow({ scan }: { scan: VaultedScan }) {
  const StatusIcon = statusStyles[scan.status].icon;

  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">{scan.patientName}</div>
          <div className="text-sm text-muted-foreground">{scan.patientId}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="font-medium">{scan.dentistName}</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span>{scan.files.length} files</span>
        </div>
      </TableCell>
      <TableCell>
        {format(scan.receivedAt, 'PPp')}
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className={statusStyles[scan.status].class}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {statusStyles[scan.status].label}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          {scan.status === 'pending' && (
            <Button variant="ghost" size="sm">
              <LinkIcon className="h-4 w-4 mr-1" />
              Match
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}