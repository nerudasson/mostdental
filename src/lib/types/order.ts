// Update the Order type to include impression type and pickup details
export type ImpressionType = 'digital_scan' | 'physical';

export type PickupDetails = {
  type: 'pickup';
  preferredDate?: Date;
  preferredTimeSlot?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'picked_up';
  address?: string;
};

export type OrderStatus = 
  | 'pending' // Initial state when order is created
  | 'pending_checkin' // Waiting for lab to check-in
  | 'rejected' // Lab rejected the order
  | 'in_progress' // Lab accepted and is working on it
  | 'completed' // Order is finished
  | 'cancelled'; // Order was cancelled

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
  impressionType: ImpressionType;
  scannerType?: string;
  scans?: {
    status: 'pending' | 'received' | 'error';
    count: number;
    error?: string;
  };
  pickupDetails?: PickupDetails;
}