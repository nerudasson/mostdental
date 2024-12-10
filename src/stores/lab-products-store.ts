import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, ProductFeature } from '@/lib/types/product';

interface LabProductsStore {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => string;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductsByLab: (labId: string) => Product[];
  getProductsByCategory: (category: string) => Product[];
  toggleProductActive: (id: string) => void;
}

export const useLabProductsStore = create<LabProductsStore>()(
  persist(
    (set, get) => ({
      products: [],

      addProduct: (product) => {
        const id = crypto.randomUUID();
        set((state) => ({
          products: [...state.products, { ...product, id }],
        }));
        return id;
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, ...updates } : product
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        }));
      },

      getProductsByLab: (labId) => {
        return get().products.filter((product) => product.labId === labId);
      },

      getProductsByCategory: (category) => {
        return get().products.filter((product) => product.category === category);
      },

      toggleProductActive: (id) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id
              ? { ...product, isActive: !product.isActive }
              : product
          ),
        }));
      },
    }),
    {
      name: 'lab-products-storage',
    }
  )
);