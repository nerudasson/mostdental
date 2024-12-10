import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useScannerIntegration } from '@/lib/scanner/hooks/use-scanner-integration';
import type { ScannerType } from '@/lib/scanner/types';

interface ScannerStatusBadgeProps {
  type: ScannerType;
}

export function ScannerStatusBadge({ type }: ScannerStatusBadgeProps) {
  const { isConnected, connecting } = useScannerIntegration(type);

  if (connecting) {
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3 mr-1" />
        Connecting
      </Badge>
    );
  }

  if (isConnected) {
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Connected
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="bg-gray-100 text-gray-800">
      <AlertCircle className="w-3 h-3 mr-1" />
      Disconnected
    </Badge>
  );
}