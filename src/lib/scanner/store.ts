import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ScannerConfig, ProcessingRule, ScanOrder } from './types';

interface ScannerState {
  configs: Record<string, ScannerConfig>;
  processingRules: ProcessingRule[];
  pendingScans: ScanOrder[];
  setConfig: (type: string, config: ScannerConfig) => void;
  updateRules: (rules: ProcessingRule[]) => void;
  addPendingScan: (scan: ScanOrder) => void;
  removePendingScan: (scanId: string) => void;
  getPendingScansForPatient: (patientId: string) => ScanOrder[];
}

export const useScannerStore = create<ScannerState>()(
  persist(
    (set, get) => ({
      configs: {},
      processingRules: [],
      pendingScans: [],

      setConfig: (type, config) => 
        set((state) => ({
          configs: { ...state.configs, [type]: config }
        })),

      updateRules: (rules) => 
        set({ processingRules: rules }),

      addPendingScan: (scan) =>
        set((state) => ({
          pendingScans: [...state.pendingScans, scan]
        })),

      removePendingScan: (scanId) =>
        set((state) => ({
          pendingScans: state.pendingScans.filter(s => s.id !== scanId)
        })),

      getPendingScansForPatient: (patientId) =>
        get().pendingScans.filter(scan => scan.patientId === patientId)
    }),
    {
      name: 'scanner-storage'
    }
  )
);