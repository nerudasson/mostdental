export type OrderStatus = 
  | 'pending' // Initial state when order is created
  | 'pending_checkin' // Waiting for lab to check-in
  | 'rejected' // Lab rejected the order
  | 'in_progress' // Lab accepted and is working on it
  | 'completed' // Order is finished
  | 'cancelled'; // Order was cancelled

export interface OrderCheckin {
  orderId: string;
  checkedInAt: Date;
  checkedInBy: string;
  estimatedCompletionDate: Date;
  notes?: string;
  rejectionReason?: string;
}

export interface Order {
  id: string;
  dentistId: string;
  dentistName: string;
  practice: string;
  patientId: string;
  patientName: string;
  treatment: {
    type: string;
    description: string;
    teeth: string[];
    notes?: string;
  };
  status: OrderStatus;
  createdAt: Date;
  dueDate: Date;
  checkin?: OrderCheckin;
  totalCost: number;
  scannerType?: string;
  scans?: {
    status: 'pending' | 'received' | 'error';
    count: number;
    error?: string;
  };
}