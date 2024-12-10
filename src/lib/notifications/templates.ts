```typescript
import { NotificationType, type NotificationTemplate } from './types';

export const notificationTemplates: Record<NotificationType, (data: any) => NotificationTemplate> = {
  // Existing templates...

  // Production notifications
  [NotificationType.PRODUCTION_ASSIGNED]: (data) => ({
    title: 'Production Step Assigned',
    description: `You have been assigned to ${data.stepName} for order #${data.orderId}`,
    actionUrl: `/lab/production/${data.orderId}`,
  }),

  [NotificationType.PRODUCTION_COMPLETED]: (data) => ({
    title: 'Production Step Completed',
    description: `${data.stepName} has been completed for order #${data.orderId}`,
    actionUrl: `/lab/production/${data.orderId}`,
  }),

  [NotificationType.PRODUCTION_ON_HOLD]: (data) => ({
    title: 'Production On Hold',
    description: `Production for order #${data.orderId} has been put on hold: ${data.reason}`,
    actionUrl: `/lab/production/${data.orderId}`,
  }),

  [NotificationType.QA_REQUIRED]: (data) => ({
    title: 'Quality Check Required',
    description: `Order #${data.orderId} requires quality inspection`,
    actionUrl: `/lab/production/${data.orderId}`,
  }),

  [NotificationType.QA_FAILED]: (data) => ({
    title: 'Quality Check Failed',
    description: `Order #${data.orderId} failed quality inspection: ${data.reason}`,
    actionUrl: `/lab/production/${data.orderId}`,
  }),
};
```