import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NotificationType, type Notification } from '@/lib/notifications/types';

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  getUnreadCount: () => number;
  getNotifications: (userId: string, role: 'dentist' | 'lab') => Notification[];
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          read: false,
        };
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));
      },
      
      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id
              ? { ...notification, read: true }
              : notification
          ),
        }));
      },
      
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            read: true,
          })),
        }));
      },
      
      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.read).length;
      },

      getNotifications: (userId, role) => {
        return get().notifications.filter(
          (n) => n.recipientId === userId && n.recipientRole === role
        );
      },
    }),
    {
      name: 'notifications-storage',
    }
  )
);