import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Menu, CircleDot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LanguageToggle } from '@/components/language-toggle';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserNav } from '@/components/user-nav';
import { NotificationsPopover } from '@/components/notifications/notifications-popover';
import { Sidebar } from './sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useProfileStore } from '@/stores/profile-store';

export function Navbar() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { logo } = useProfileStore();

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center gap-4">
          {logo ? (
            <img 
              src={logo} 
              alt={user?.name || 'Logo'} 
              className="h-10 w-auto object-contain"
            />
          ) : (
            <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
              <CircleDot className="h-6 w-6 text-primary" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.name}</span>
            <Link to="/" className="text-xs text-muted-foreground">
              DentalConnect
            </Link>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <NotificationsPopover />
          <LanguageToggle />
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}