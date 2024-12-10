import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  TestTubes, 
  User, 
  Settings,
  CircleDollarSign,
  Users,
  ChevronLeft,
  ChevronRight,
  Shield,
  Cog,
  Truck,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

const dentistNavigation = [
  { name: 'nav.dashboard', href: '/', icon: LayoutDashboard },
  { name: 'nav.patients', href: '/patients', icon: Users },
  { name: 'nav.estimates', href: '/estimates', icon: CircleDollarSign },
  { name: 'nav.orders', href: '/orders', icon: FileText },
  { name: 'nav.invoices', href: '/invoices', icon: FileText },
  { name: 'nav.messages', href: '/messages', icon: MessageSquare },
  { name: 'nav.profile', href: '/profile', icon: User },
  { name: 'nav.settings', href: '/settings', icon: Settings },
];

const labNavigation = [
  { name: 'nav.dashboard', href: '/lab', icon: LayoutDashboard },
  { name: 'nav.estimates', href: '/lab/estimates', icon: CircleDollarSign },
  { name: 'nav.orders', href: '/lab/orders', icon: TestTubes },
  { name: 'nav.invoices', href: '/lab/invoices', icon: FileText },
  { name: 'nav.pickups', href: '/lab/pickups', icon: Truck },
  { name: 'nav.secure_inbox', href: '/lab/secure-inbox', icon: Shield },
  { name: 'nav.scan_processing', href: '/lab/scan-processing', icon: Cog },
  { name: 'nav.messages', href: '/messages', icon: MessageSquare },
  { name: 'nav.profile', href: '/profile', icon: User },
  { name: 'nav.settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = user?.role === 'lab' ? labNavigation : dentistNavigation;

  return (
    <nav 
      className={cn(
        "hidden md:flex flex-col border-r min-h-[calc(100vh-4rem)] bg-background transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-sidebar"
      )}
    >
      <div className="flex-1 space-y-2 p-4">
        {navigation.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-secondary",
                isCollapsed && "justify-center"
              )
            }
            title={isCollapsed ? t(item.name) : undefined}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>{t(item.name)}</span>}
          </NavLink>
        ))}
      </div>
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </nav>
  );
}