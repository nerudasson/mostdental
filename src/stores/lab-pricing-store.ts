import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LabPricingConfig, Material, MaterialType, BEBPosition, BELPosition } from '@/lib/pricing/types';
import { BEBCategory } from '@/lib/pricing/types';

interface LabPricingStore {
  config: LabPricingConfig;
  updateConfig: (updates: Partial<LabPricingConfig>) => void;
  addMaterialType: (materialType: Omit<MaterialType, 'id'>) => void;
  updateMaterialType: (id: string, updates: Partial<MaterialType>) => void;
  deleteMaterialType: (id: string) => void;
  addMaterial: (material: Omit<Material, 'id'>) => void;
  updateMaterial: (id: string, updates: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;
  updateBEBPosition: (code: string, updates: Partial<BEBPosition>) => void;
  updateBELPosition: (code: string, updates: Partial<BELPosition>) => void;
  setBEBCustomPrice: (code: string, price: number) => void;
}

const defaultConfig: LabPricingConfig = {
  autoAcceptEstimates: false,
  belPointValue: 2.3,
  defaultRegionFactor: 1.0,
  materialTypes: [],
  materials: [],
  bebPositions: {},
  belPositions: {},
  customPrices: {},
};

export const useLabPricingStore = create<LabPricingStore>()(
  persist(
    (set, get) => ({
      config: defaultConfig,

      updateConfig: (updates) =>
        set((state) => ({
          config: { ...state.config, ...updates },
        })),

      addMaterialType: (materialType) =>
        set((state) => ({
          config: {
            ...state.config,
            materialTypes: [
              ...state.config.materialTypes,
              { ...materialType, id: crypto.randomUUID() },
            ],
          },
        })),

      updateMaterialType: (id, updates) =>
        set((state) => ({
          config: {
            ...state.config,
            materialTypes: state.config.materialTypes.map((type) =>
              type.id === id ? { ...type, ...updates } : type
            ),
          },
        })),

      deleteMaterialType: (id) =>
        set((state) => ({
          config: {
            ...state.config,
            materialTypes: state.config.materialTypes.filter((type) => type.id !== id),
            // Also remove materials using this type
            materials: state.config.materials.filter((mat) => mat.typeId !== id),
          },
        })),

      addMaterial: (material) =>
        set((state) => ({
          config: {
            ...state.config,
            materials: [
              ...state.config.materials,
              { ...material, id: crypto.randomUUID() },
            ],
          },
        })),

      updateMaterial: (id, updates) =>
        set((state) => ({
          config: {
            ...state.config,
            materials: state.config.materials.map((mat) =>
              mat.id === id ? { ...mat, ...updates } : mat
            ),
          },
        })),

      deleteMaterial: (id) =>
        set((state) => ({
          config: {
            ...state.config,
            materials: state.config.materials.filter((mat) => mat.id !== id),
          },
        })),

      updateBEBPosition: (code, updates) =>
        set((state) => ({
          config: {
            ...state.config,
            bebPositions: {
              ...state.config.bebPositions,
              [code]: {
                ...state.config.bebPositions[code],
                ...updates,
              },
            },
          },
        })),

      updateBELPosition: (code, updates) =>
        set((state) => ({
          config: {
            ...state.config,
            belPositions: {
              ...state.config.belPositions,
              [code]: {
                ...state.config.belPositions[code],
                ...updates,
              },
            },
          },
        })),

      setBEBCustomPrice: (code, price) =>
        set((state) => ({
          config: {
            ...state.config,
            customPrices: {
              ...state.config.customPrices,
              [code]: price,
            },
          },
        })),
    }),
    {
      name: 'lab-pricing-storage',
    }
  )
);