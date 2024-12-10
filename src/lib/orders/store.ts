import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, OrderStatus, OrderCheckin } from './types';

interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (
    orderId: string, 
    update: { 
      status: OrderStatus;
      checkin?: OrderCheckin;
    }
  ) => void;
  getOrder: (orderId: string) => Order | undefined;
  getOrdersByDentist: (dentistId: string) => Order[];
  getOrdersByLab: (labId: string) => Order[];
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      
      addOrder: (order) => 
        set((state) => ({
          orders: [...state.orders, order]
        })),
      
      updateOrderStatus: (orderId, update) =>
        set((state) => ({
          orders: state.orders.map(order =>
            order.id === orderId
              ? { ...order, ...update }
              : order
          )
        })),
      
      getOrder: (orderId) =>
        get().orders.find(order => order.id === orderId),
      
      getOrdersByDentist: (dentistId) =>
        get().orders.filter(order => order.dentistId === dentistId),
      
      getOrdersByLab: (labId) =>
        get().orders.filter(order => order.labId === labId)
    }),
    {
      name: 'order-storage'
    }
  )
);