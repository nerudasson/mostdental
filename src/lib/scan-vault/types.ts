import { IndicationType } from '../scanner/types';

export interface VaultedScan {
  id: string;
  scannerType: string;
  dentistId: string;
  dentistName: string;
  patientId: string;
  patientName: string;
  receivedAt: Date;
  files: VaultedFile[];
  metadata: {
    indication?: IndicationType;
    teeth?: string[];
    notes?: string;
  };
  matchedOrderId?: string;
  status: 'pending' | 'matched' | 'processed' | 'error';
  processingError?: string;
}

export interface VaultedFile {
  id: string;
  name: string;
  type: 'scan' | 'metadata' | 'auxiliary';
  size: number;
  path: string;
  downloaded: boolean;
  lastDownloadedAt?: Date;
}

export interface ProcessingConfig {
  threeshape?: {
    enabled: boolean;
    importLocation: string;
    version: string;
    createXml: boolean;
  };
  exocad?: {
    enabled: boolean;
    importLocation: string;
    version: string;
    createJson: boolean;
  };
  folderStructure: {
    usePracticeFolders: boolean;
    usePatientFolders: boolean;
    useCaseFolders: boolean;
    namingPattern: string; // e.g., "{practice}/{patientId}/{caseId}"
  };
}

export interface ProcessingResult {
  success: boolean;
  targetLocation?: string;
  error?: string;
  processedFiles: string[];
}