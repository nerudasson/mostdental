import { useState, useCallback } from 'react';
import { useScanVault } from '../store';
import { ScanProcessor } from '../processor';
import { useToast } from '@/hooks/use-toast';
import type { VaultedScan } from '../types';

export function useScanProcessing() {
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const { config, updateScanStatus } = useScanVault();

  const processor = new ScanProcessor(config);

  const processScan = useCallback(async (scan: VaultedScan) => {
    if (!scan.matchedOrderId) {
      throw new Error('Cannot process scan without matched order');
    }

    setProcessing(true);
    try {
      const result = await processor.processScan(scan);
      
      if (result.success) {
        updateScanStatus(scan.id, 'processed');
        toast({
          title: 'Scan processed successfully',
          description: `Files saved to ${result.targetLocation}`
        });
      } else {
        updateScanStatus(scan.id, 'error', result.error);
        toast({
          title: 'Processing failed',
          description: result.error,
          variant: 'destructive'
        });
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updateScanStatus(scan.id, 'error', errorMessage);
      toast({
        title: 'Processing failed',
        description: errorMessage,
        variant: 'destructive'
      });
      throw error;
    } finally {
      setProcessing(false);
    }
  }, [config, updateScanStatus, toast]);

  return {
    processScan,
    processing
  };
}