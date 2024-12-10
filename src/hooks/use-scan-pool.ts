import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useNotificationStore } from '@/hooks/use-notifications';
import { useToast } from '@/hooks/use-toast';

interface PendingScan {
  id: string;
  patientId: string;
  dentistId: string;
  scannerType: string;
  files: {
    id: string;
    name: string;
    url: string;
    type: 'scan' | 'metadata';
    size: number;
    uploadedAt: Date;
  }[];
  receivedAt: Date;
  matchedOrderId?: string;
  status: 'pending' | 'matched' | 'processing' | 'error';
  error?: string;
}

interface ScanPoolStore {
  pendingScans: PendingScan[];
  addScan: (scan: Omit<PendingScan, 'receivedAt' | 'status'>) => void;
  matchScanToOrder: (scanId: string, orderId: string) => void;
  getUnmatchedScans: (patientId: string) => PendingScan[];
  getMatchedScans: (orderId: string) => PendingScan[];
  updateScanStatus: (scanId: string, status: PendingScan['status'], error?: string) => void;
}

export const useScanPool = create<ScanPoolStore>()(
  persist(
    (set, get) => ({
      pendingScans: [],
      
      addScan: (scan) => {
        const { addNotification } = useNotificationStore.getState();
        const { toast } = useToast.getState();

        set((state) => ({
          pendingScans: [
            ...state.pendingScans,
            { 
              ...scan, 
              receivedAt: new Date(),
              status: 'pending',
            },
          ],
        }));

        // Notify about new scan
        addNotification({
          type: 'order_message',
          title: 'New Scan Received',
          description: `New ${scan.scannerType} scan received for patient ${scan.patientId}`,
          orderId: scan.matchedOrderId,
        });

        toast({
          title: 'Scan received',
          description: 'New scan has been added to the pool',
        });
      },
      
      matchScanToOrder: (scanId, orderId) => {
        const { addNotification } = useNotificationStore.getState();
        const { toast } = useToast.getState();

        set((state) => ({
          pendingScans: state.pendingScans.map((scan) =>
            scan.id === scanId
              ? { ...scan, matchedOrderId: orderId, status: 'matched' }
              : scan
          ),
        }));

        // Notify about scan matching
        addNotification({
          type: 'order_message',
          title: 'Scan Matched',
          description: 'Scan has been matched to order',
          orderId,
        });

        toast({
          title: 'Scan matched',
          description: 'Scan has been successfully matched to order',
        });
      },
      
      updateScanStatus: (scanId, status, error) => {
        const { addNotification } = useNotificationStore.getState();
        const scan = get().pendingScans.find(s => s.id === scanId);

        set((state) => ({
          pendingScans: state.pendingScans.map((scan) =>
            scan.id === scanId
              ? { ...scan, status, error }
              : scan
          ),
        }));

        if (scan?.matchedOrderId) {
          addNotification({
            type: 'order_message',
            title: `Scan ${status === 'error' ? 'Error' : 'Status Update'}`,
            description: error || `Scan status updated to ${status}`,
            orderId: scan.matchedOrderId,
          });
        }
      },
      
      getUnmatchedScans: (patientId) => {
        return get().pendingScans.filter(
          (scan) => scan.patientId === patientId && !scan.matchedOrderId
        );
      },
      
      getMatchedScans: (orderId) => {
        return get().pendingScans.filter(
          (scan) => scan.matchedOrderId === orderId
        );
      },
    }),
    {
      name: 'scan-pool-storage',
    }
  )
);