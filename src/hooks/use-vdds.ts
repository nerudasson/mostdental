import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VDDSClient } from '@/lib/vdds/client';
import type { VDDSConfig, VDDSPatient } from '@/lib/vdds/types';

interface VDDSState {
  config: VDDSConfig | null;
  client: VDDSClient | null;
  connected: boolean;
  setConfig: (config: VDDSConfig) => void;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  searchPatients: (query: string) => Promise<VDDSPatient[]>;
  getPatientBefunde: (patientId: string) => Promise<Record<string, string>>;
}

export const useVDDS = create<VDDSState>()(
  persist(
    (set, get) => ({
      config: null,
      client: null,
      connected: false,

      setConfig: (config) => {
        const client = new VDDSClient(config);
        set({ config, client });
      },

      connect: async () => {
        // In development, always return success
        set({ connected: true });
        return true;
      },

      disconnect: () => {
        set({ connected: false });
      },

      searchPatients: async (query) => {
        // Return mock data in development
        return [
          {
            id: 'P001',
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: new Date('1980-05-15'),
            insurance: {
              type: 'public',
              provider: 'AOK',
              number: '123456789',
              bonusYears: 10
            },
            befunde: {
              '11': 'k',
              '12': 'f',
              '21': 'e'
            }
          },
          {
            id: 'P002',
            firstName: 'Jane',
            lastName: 'Smith',
            dateOfBirth: new Date('1975-08-22'),
            insurance: {
              type: 'private',
              provider: 'DKV',
              number: '987654321',
              bonusYears: 5
            },
            befunde: {
              '14': 'k',
              '15': 'f',
              '16': 'e'
            }
          }
        ];
      },

      getPatientBefunde: async (patientId) => {
        // Return mock data in development
        return {
          '11': 'k',
          '12': 'f',
          '21': 'e',
          '22': 'kw'
        };
      },
    }),
    {
      name: 'vdds-storage',
    }
  )
);