import { useState, useEffect } from 'react';
import { useScanPool } from './use-scan-pool';
import { useToast } from '@/hooks/use-toast';
import type { PendingScan } from '@/lib/types/scan';

export function useOrderScans(orderId: string) {
  const { toast } = useToast();
  const { getMatchedScans, updateScanStatus } = useScanPool();
  const [scans, setScans] = useState<PendingScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    try {
      // Get all scans matched to this order
      const orderScans = getMatchedScans(orderId);
      setScans(orderScans);
      setError(null);

      // Update order status based on scan status
      const hasErrors = orderScans.some(scan => scan.status === 'error');
      const allProcessed = orderScans.every(scan => scan.status === 'processing');

      if (hasErrors) {
        toast({
          title: 'Scan processing error',
          description: 'One or more scans have processing errors',
          variant: 'destructive',
        });
      } else if (allProcessed) {
        toast({
          title: 'Scans processed',
          description: 'All scans have been successfully processed',
        });
      }
    } catch (err) {
      setError('Failed to load scans');
      setScans([]);
      toast({
        title: 'Error',
        description: 'Failed to load order scans',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const processScan = async (scanId: string) => {
    try {
      updateScanStatus(scanId, 'processing');
      // Here you would integrate with your scan processing service
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateScanStatus(scanId, 'processed');
    } catch (error) {
      updateScanStatus(
        scanId, 
        'error', 
        error instanceof Error ? error.message : 'Failed to process scan'
      );
    }
  };

  return {
    scans,
    loading,
    error,
    processScan,
  };
}