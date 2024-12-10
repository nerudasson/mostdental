import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useNotificationStore } from '@/hooks/use-notifications';
import { useAuth } from '@/hooks/use-auth';

export function NotificationList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, markAsRead } = useNotificationStore();

  const handleClick = (notification: any) => {
    markAsRead(notification.id);

    // Navigate based on notification type
    if (notification.orderId) {
      const path = user?.role === 'lab' 
        ? `/lab/orders/${notification.orderId}`
        : `/orders/${notification.orderId}`;
      navigate(path);
    } else if (notification.estimateId) {
      const path = user?.role === 'lab' 
        ? `/lab/estimates/${notification.estimateId}`
        : `/estimates/${notification.estimateId}`;
      navigate(path);
    }
  };

  return (
    <ScrollArea className="h-[300px]">
      {notifications.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          No notifications
        </div>
      ) : (
        <div className="space-y-1">
          {notifications.map((notification) => (
            <Button
              key={notification.id}
              variant="ghost"
              className={`w-full text-left p-3 h-auto flex flex-col items-start ${
                !notification.read ? 'bg-accent/50' : ''
              }`}
              onClick={() => handleClick(notification)}
            >
              <div className="flex justify-between items-start gap-2 w-full">
                <div>
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(notification.createdAt), 'PPp')}
                  </p>
                </div>
                {!notification.read && (
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                )}
              </div>
            </Button>
          ))}
        </div>
      )}
    </ScrollArea>
  );
}