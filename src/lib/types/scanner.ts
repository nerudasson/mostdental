export enum ScannerType {
  TRIOS = 'trios',
  ITERO = 'itero',
  PRIMESCAN = 'primescan',
  MEDIT = 'medit',
  CARESTREAM = 'carestream'
}

export enum IndicationType {
  CROWN = 'crown',
  BRIDGE = 'bridge',
  INLAY = 'inlay',
  ONLAY = 'onlay',
  VENEER = 'veneer',
  IMPLANT = 'implant'
}

export interface ScannerConfig {
  type: ScannerType;
  enabled: boolean;
  apiConfig: Record<string, any>;
  processingRules?: ProcessingRule[];
}

export interface ProcessingRule {
  id: string;
  priority: number;
  scannerType: ScannerType;
  indicationType: IndicationType;
  preferredSoftware: 'threeshape' | 'exocad';
  requiresDownload: boolean;
  conditions?: RuleCondition[];
}

export interface RuleCondition {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith';
  value: any;
}

export interface ScanOrder {
  id: string;
  scannerType: ScannerType;
  indicationType: IndicationType;
  patientId: string;
  dentistId: string;
  createdAt: Date;
  files: ScanFile[];
  metadata: Record<string, any>;
}

export interface ScanFile {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: Date;
}

export interface ProcessingResult {
  success: boolean;
  orderId: string;
  processingPath?: string;
  designSoftware: string;
  error?: string;
  downloadRequired: boolean;
  filesProcessed?: string[];
}