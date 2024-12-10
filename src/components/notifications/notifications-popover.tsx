import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { NotificationBadge } from './notification-badge';
import { NotificationList } from './notification-list';
import { useNotificationStore } from '@/hooks/use-notifications';

export function NotificationsPopover() {
  const { markAllAsRead, getUnreadCount } = useNotificationStore();
  const unreadCount = getUnreadCount();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <NotificationBadge />
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex justify-between items-center border-b pb-2">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <NotificationList />
      </PopoverContent>
    </Popover>
  );
}