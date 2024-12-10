import { useState, useCallback } from 'react';
import { useScannerStore } from '../store';
import type { ScanOrder, ProcessingResult } from '../types';
import { useToast } from '@/hooks/use-toast';

export function useScanProcessing() {
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const { configs, processingRules } = useScannerStore();

  const processScan = useCallback(async (
    scan: ScanOrder
  ): Promise<ProcessingResult> => {
    setProcessing(true);
    try {
      // Here we would actually process the scan
      // For now, just simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const config = configs[scan.scannerType];
      if (!config?.enabled) {
        throw new Error('Scanner not configured');
      }

      // Find matching processing rule
      const rule = processingRules.find(r => 
        r.scannerType === scan.scannerType &&
        r.indicationType === scan.indicationType
      );

      if (!rule) {
        throw new Error('No matching processing rule found');
      }

      const result: ProcessingResult = {
        success: true,
        orderId: scan.id,
        designSoftware: rule.preferredSoftware,
        downloadRequired: rule.requiresDownload,
        filesProcessed: scan.files.map(f => f.name)
      };

      toast({
        title: 'Processing complete',
        description: `Successfully processed scan ${scan.id}`
      });

      return result;
    } catch (error) {
      toast({
        title: 'Processing failed',
        description: error instanceof Error ? error.message : 'Failed to process scan',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setProcessing(false);
    }
  }, [configs, processingRules, toast]);

  return {
    processScan,
    processing
  };
}