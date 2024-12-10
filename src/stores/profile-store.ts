import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileState {
  logo: string | null;
  setLogo: (logo: string | null) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      logo: null,
      setLogo: (logo) => set({ logo }),
    }),
    {
      name: 'profile-storage',
    }
  )
);