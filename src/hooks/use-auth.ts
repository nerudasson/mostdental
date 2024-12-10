import { create } from 'zustand';
import type { User } from '@/lib/types/user';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  switchRole: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: {
    id: '1',
    name: 'Dr. Smith',
    email: 'dr.smith@example.com',
    role: 'dentist',
    practice: 'Smith Dental Practice'
  },
  setUser: (user) => set({ user }),
  switchRole: () => set((state) => ({
    user: state.user ? {
      ...state.user,
      id: state.user.role === 'dentist' ? '2' : '1',
      name: state.user.role === 'dentist' ? 'Best Lab' : 'Dr. Smith',
      role: state.user.role === 'dentist' ? 'lab' : 'dentist',
      practice: state.user.role === 'dentist' ? undefined : 'Smith Dental Practice',
      labName: state.user.role === 'dentist' ? 'Best Lab' : undefined,
    } : null
  })),
}));