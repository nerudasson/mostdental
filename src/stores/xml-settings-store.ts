import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { XMLSettings } from '@/lib/types/xml-settings';
import { BillingRegion } from '@/lib/types/xml-settings';

interface XMLSettingsStore {
  settings: XMLSettings;
  updateSettings: (updates: Partial<XMLSettings>) => void;
  addManufacturingLocation: (name: string) => void;
  removeManufacturingLocation: (id: string) => void;
  setDefaultManufacturingLocation: (id: string) => void;
}

const defaultSettings: XMLSettings = {
  companyName: '',
  labId: '',
  manufacturingLocations: [],
  billingRegion: BillingRegion.HH,
  nemUnitPrice: 0,
};

export const useXMLSettingsStore = create<XMLSettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,

      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      addManufacturingLocation: (name) =>
        set((state) => ({
          settings: {
            ...state.settings,
            manufacturingLocations: [
              ...state.settings.manufacturingLocations,
              {
                id: crypto.randomUUID(),
                name,
                isDefault: state.settings.manufacturingLocations.length === 0,
              },
            ],
          },
        })),

      removeManufacturingLocation: (id) =>
        set((state) => ({
          settings: {
            ...state.settings,
            manufacturingLocations: state.settings.manufacturingLocations.filter(
              (loc) => loc.id !== id
            ),
          },
        })),

      setDefaultManufacturingLocation: (id) =>
        set((state) => ({
          settings: {
            ...state.settings,
            manufacturingLocations: state.settings.manufacturingLocations.map(
              (loc) => ({
                ...loc,
                isDefault: loc.id === id,
              })
            ),
          },
        })),
    }),
    {
      name: 'xml-settings-storage',
    }
  )
);