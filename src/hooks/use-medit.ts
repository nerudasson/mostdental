import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MeditAPI } from '@/lib/api/medit';

interface MeditCredentials {
  clientId: string;
  clientSecret: string;
}

interface MeditStore {
  credentials: MeditCredentials | null;
  setCredentials: (credentials: MeditCredentials) => void;
  removeCredentials: () => void;
  api: MeditAPI | null;
}

export const useMeditStore = create<MeditStore>()(
  persist(
    (set, get) => ({
      credentials: null,
      api: null,
      setCredentials: (credentials) => {
        const api = new MeditAPI(credentials.clientId, credentials.clientSecret);
        set({ credentials, api });
      },
      removeCredentials: () => {
        set({ credentials: null, api: null });
      },
    }),
    {
      name: 'medit-storage',
    }
  )
);