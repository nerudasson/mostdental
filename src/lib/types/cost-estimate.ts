export interface CostEstimate {
  id: string;
  dentist: {
    id: string;
    name: string;
    practice: string;
    email: string;
  };
  patient: {
    id: string;
    name: string;
  };
  treatment: {
    type: string;
    description: string;
    teeth: string[];
    befunde: Record<string, string>;
    regelversorgung: Record<string, string>;
    therapie: Record<string, string>;
  };
  lab?: {
    id: string;
    name: string;
  };
  status: 'draft' | 'pending_lab' | 'priced' | 'accepted' | 'rejected';
  totalCost?: number;
  labFees?: number;
  festzuschuss: number;
  patientPortion?: number;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}