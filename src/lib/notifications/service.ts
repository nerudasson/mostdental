import { NotificationType, type Notification } from './types';
import { notificationTemplates } from './templates';
import { useNotificationStore } from '@/hooks/use-notifications';

export class NotificationService {
  private static instance: NotificationService;
  
  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  notify(params: {
    type: NotificationType;
    recipientId: string;
    recipientRole: 'dentist' | 'lab';
    data: any;
  }): void {
    const { type, recipientId, recipientRole, data } = params;
    const template = notificationTemplates[type](data);

    const notification: Omit<Notification, 'id' | 'createdAt' | 'read'> = {
      type,
      recipientId,
      recipientRole,
      title: template.title,
      description: template.description,
      actionUrl: template.actionUrl,
      orderId: data.orderId,
      estimateId: data.estimateId,
      scanId: data.scanId,
    };

    const { addNotification } = useNotificationStore.getState();
    addNotification(notification);
  }

  markAsRead(notificationId: string): void {
    const { markAsRead } = useNotificationStore.getState();
    markAsRead(notificationId);
  }

  markAllAsRead(userId: string): void {
    const { markAllAsRead } = useNotificationStore.getState();
    markAllAsRead();
  }

  getUnreadCount(userId: string): number {
    const { getUnreadCount } = useNotificationStore.getState();
    return getUnreadCount();
  }
}

export const notificationService = NotificationService.getInstance();