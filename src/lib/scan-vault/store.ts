import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { VaultedScan, ProcessingConfig } from './types';

interface ScanVaultState {
  scans: VaultedScan[];
  config: ProcessingConfig;
  addScan: (scan: VaultedScan) => void;
  removeScan: (scanId: string) => void;
  updateScanStatus: (scanId: string, status: VaultedScan['status'], error?: string) => void;
  matchScanToOrder: (scanId: string, orderId: string) => void;
  markFileDownloaded: (scanId: string, fileId: string) => void;
  updateConfig: (config: ProcessingConfig) => void;
}

const defaultConfig: ProcessingConfig = {
  threeshape: {
    enabled: false,
    importLocation: '',
    version: '',
    createXml: true
  },
  exocad: {
    enabled: false,
    importLocation: '',
    version: '',
    createJson: true
  },
  folderStructure: {
    usePracticeFolders: true,
    usePatientFolders: true,
    useCaseFolders: true,
    namingPattern: '{practice}/{patientId}/{caseId}'
  }
};

export const useScanVault = create<ScanVaultState>()(
  persist(
    (set, get) => ({
      scans: [],
      config: defaultConfig,

      addScan: (scan) => 
        set((state) => ({
          scans: [...state.scans, scan]
        })),

      removeScan: (scanId) =>
        set((state) => ({
          scans: state.scans.filter(s => s.id !== scanId)
        })),

      updateScanStatus: (scanId, status, error) =>
        set((state) => ({
          scans: state.scans.map(scan =>
            scan.id === scanId
              ? { ...scan, status, processingError: error }
              : scan
          )
        })),

      matchScanToOrder: (scanId, orderId) =>
        set((state) => ({
          scans: state.scans.map(scan =>
            scan.id === scanId
              ? { ...scan, matchedOrderId: orderId, status: 'matched' }
              : scan
          )
        })),

      markFileDownloaded: (scanId, fileId) =>
        set((state) => ({
          scans: state.scans.map(scan =>
            scan.id === scanId
              ? {
                  ...scan,
                  files: scan.files.map(file =>
                    file.id === fileId
                      ? { ...file, downloaded: true, lastDownloadedAt: new Date() }
                      : file
                  )
                }
              : scan
          )
        })),

      updateConfig: (config) =>
        set({ config })
    }),
    {
      name: 'scan-vault-storage'
    }
  )
);