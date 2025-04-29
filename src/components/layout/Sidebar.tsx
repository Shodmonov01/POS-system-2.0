import { useLocation, NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  ShoppingBag,
  PackageOpen,
  CreditCard,
  RotateCcw,
  UserCircle2,
  Building,
  Settings,
  ScanBarcode 
} from 'lucide-react';

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles?: Array<'admin' | 'cashier'>;
}

export function Sidebar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  
  const links: SidebarLink[] = [
    {
      href: '/dashboard',
      label: 'Панель управления',
      icon: <LayoutDashboard className="h-5 w-5" />,
      roles: ['admin', 'cashier'],
    },
    {
      href: '/sales',
      label: 'Продажи',
      icon: <ShoppingBag className="h-5 w-5" />,
      roles: ['admin'],
    },
    {
      href: '/scaner',
      label: 'Сканер',
      icon: <ScanBarcode  className="h-5 w-5" />,
      roles: ['admin', 'cashier'],
    },
    {
      href: '/products',
      label: 'Товары',
      icon: <PackageOpen className="h-5 w-5" />,
      roles: ['admin'],
    },
    {
      href: '/debts',
      label: 'Долги',
      icon: <CreditCard className="h-5 w-5" />,
      roles: ['admin', 'cashier'],
    },
    {
      href: '/returns',
      label: 'Возвраты',
      icon: <RotateCcw className="h-5 w-5" />,
      roles: ['admin', 'cashier'],
    },
    {
      href: '/users',
      label: 'Кассир',
      icon: <UserCircle2 className="h-5 w-5" />,
      roles: ['admin'],
    },
    {
      href: '/branches',
      label: 'Филиалы',
      icon: <Building className="h-5 w-5" />,
      roles: ['admin'],
    },
    {
      href: '/settings',
      label: 'Настройки',
      icon: <Settings className="h-5 w-5" />,
      roles: ['admin'],
    },
  ];

  const filteredLinks = links.filter(
    (link) => !link.roles || (user && link.roles.includes(user.role))
  );

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r bg-background pt-14 md:flex">
      <div className="flex flex-1 flex-col">
        <nav className="flex-1 space-y-1 p-4">
          {filteredLinks.map((link) => {
            const isActive = pathname === link.href;
            
            return (
              <NavLink
                key={link.href}
                to={link.href}
                className={cn(
                  'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}