import { useState } from 'react';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useScanVault } from '@/lib/scan-vault/store';
import type { VaultedScan } from '@/lib/scan-vault/types';

interface ScanMatchDialogProps {
  scan: VaultedScan;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock orders - in real app, fetch from your order store
const mockOrders = [
  { id: 'O001', patientName: 'John Doe', type: 'Crown', date: '2024-02-20' },
  { id: 'O002', patientName: 'Jane Smith', type: 'Bridge', date: '2024-02-19' },
];

export function ScanMatchDialog({
  scan,
  open,
  onOpenChange
}: ScanMatchDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { matchScanToOrder } = useScanVault();

  const filteredOrders = mockOrders.filter(order =>
    order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMatch = (orderId: string) => {
    matchScanToOrder(scan.id, orderId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Match Scan to Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="space-y-2">
              {filteredOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => handleMatch(order.id)}
                  className="w-full text-left p-3 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="font-medium">{order.patientName}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.id} • {order.type} • {order.date}
                  </div>
                </button>
              ))}
              {filteredOrders.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No matching orders found
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}