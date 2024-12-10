import { useState, useCallback } from 'react';
import { useScannerStore } from '../store';
import type { ScannerType, ScannerConfig, ProcessingRule } from '../types';
import { useToast } from '@/hooks/use-toast';

export function useScannerIntegration(type: ScannerType) {
  const { toast } = useToast();
  const [connecting, setConnecting] = useState(false);
  const { configs, setConfig } = useScannerStore();

  const connect = useCallback(async (credentials: Record<string, any>) => {
    setConnecting(true);
    try {
      // Here we would actually connect to the scanner API
      // For now, just simulate the connection
      await new Promise(resolve => setTimeout(resolve, 1000));

      const config: ScannerConfig = {
        type,
        enabled: true,
        apiConfig: credentials,
        processingRules: []
      };

      setConfig(type, config);

      toast({
        title: 'Connection successful',
        description: `Successfully connected to ${type} scanner.`
      });

      return true;
    } catch (error) {
      toast({
        title: 'Connection failed',
        description: error instanceof Error ? error.message : 'Failed to connect to scanner',
        variant: 'destructive'
      });
      return false;
    } finally {
      setConnecting(false);
    }
  }, [type, setConfig, toast]);

  const disconnect = useCallback(() => {
    try {
      // Here we would disconnect from the scanner API
      setConfig(type, {
        type,
        enabled: false,
        apiConfig: {}
      });

      toast({
        title: 'Disconnected',
        description: `Successfully disconnected from ${type} scanner.`
      });

      return true;
    } catch (error) {
      toast({
        title: 'Disconnect failed',
        description: error instanceof Error ? error.message : 'Failed to disconnect from scanner',
        variant: 'destructive'
      });
      return false;
    }
  }, [type, setConfig, toast]);

  const isConnected = configs[type]?.enabled ?? false;
  const currentConfig = configs[type];

  return {
    connect,
    disconnect,
    isConnected,
    connecting,
    currentConfig
  };
}