export type UserRole = 'dentist' | 'lab';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  practice?: string;  // For dentists
  labName?: string;   // For labs
}