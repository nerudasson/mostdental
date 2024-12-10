import { forwardRef } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotificationStore } from '@/hooks/use-notifications';

export const NotificationBadge = forwardRef<HTMLButtonElement>((props, ref) => {
  const unreadCount = useNotificationStore((state) => state.getUnreadCount());

  if (unreadCount === 0) {
    return (
      <Button ref={ref} variant="ghost" size="icon" {...props}>
        <Bell className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button ref={ref} variant="ghost" size="icon" className="relative" {...props}>
      <Bell className="h-5 w-5" />
      <Badge 
        variant="destructive" 
        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
      >
        {unreadCount}
      </Badge>
    </Button>
  );
});

NotificationBadge.displayName = 'NotificationBadge';