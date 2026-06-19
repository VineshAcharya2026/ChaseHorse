'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@chasehorse/shared';
import {
  LayoutDashboard,
  Building2,
  Users,
  Truck,
  Package,
  Warehouse,
  BarChart3,
  CreditCard,
  Plug,
  FileText,
  Settings,
  LogOut,
  Car,
  HeadphonesIcon,
  GitBranch,
  Key,
  Workflow,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@chasehorse/auth-client';
import type { UserRole } from '@chasehorse/shared';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_CONFIG: Record<UserRole, NavItem[]> = {
  super_admin: [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Companies', href: '/admin/companies', icon: Building2 },
    { label: 'Drivers', href: '/admin/drivers', icon: Users },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Shipments', href: '/admin/shipments', icon: Package },
    { label: 'Warehouses', href: '/admin/warehouses', icon: Warehouse },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Billing', href: '/admin/billing', icon: CreditCard },
    { label: 'Integrations', href: '/admin/integrations', icon: Plug },
    { label: 'Audit Logs', href: '/admin/audit', icon: FileText },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ],
  company_admin: [
    { label: 'Dashboard', href: '/company', icon: LayoutDashboard },
    { label: 'Branches', href: '/company/branches', icon: GitBranch },
    { label: 'Drivers', href: '/company/drivers', icon: Users },
    { label: 'Vehicles', href: '/company/vehicles', icon: Car },
    { label: 'Shipments', href: '/company/shipments', icon: Package },
    { label: 'Customers', href: '/company/customers', icon: Users },
    { label: 'Billing', href: '/company/billing', icon: CreditCard },
    { label: 'Reports', href: '/company/reports', icon: BarChart3 },
    { label: 'Integrations', href: '/company/integrations', icon: Plug },
    { label: 'Support', href: '/company/support', icon: HeadphonesIcon },
  ],
  branch_manager: [
    { label: 'Dashboard', href: '/branch', icon: LayoutDashboard },
    { label: 'Shipments', href: '/branch/shipments', icon: Package },
    { label: 'Drivers', href: '/branch/drivers', icon: Users },
    { label: 'Warehouse', href: '/branch/warehouse', icon: Warehouse },
    { label: 'Analytics', href: '/branch/analytics', icon: BarChart3 },
  ],
  driver: [
    { label: 'Tasks', href: '/driver', icon: Package },
    { label: 'Navigation', href: '/driver/navigation', icon: Truck },
    { label: 'POD', href: '/driver/pod', icon: FileText },
    { label: 'Profile', href: '/driver/profile', icon: Users },
  ],
  customer: [
    { label: 'Book', href: '/portal', icon: Package },
    { label: 'Track', href: '/portal/track', icon: Truck },
    { label: 'Invoices', href: '/portal/invoices', icon: CreditCard },
    { label: 'Support', href: '/portal/support', icon: HeadphonesIcon },
  ],
  enterprise_user: [
    { label: 'Dashboard', href: '/enterprise', icon: LayoutDashboard },
    { label: 'Bulk Upload', href: '/enterprise/bulk', icon: Package },
    { label: 'API Keys', href: '/enterprise/api-keys', icon: Key },
    { label: 'Team', href: '/enterprise/team', icon: Users },
    { label: 'Reports', href: '/enterprise/reports', icon: BarChart3 },
    { label: 'Workflows', href: '/enterprise/workflows', icon: Workflow },
  ],
};

export function DashboardShell({
  children,
  role,
}: {
  children: React.ReactNode;
  role: UserRole;
}) {
  const pathname = usePathname();
  const { clearAuth, user } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = NAV_CONFIG[role] ?? [];

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 glass transform transition-transform lg:translate-x-0 lg:static',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center px-6 border-b border-white/10">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            {APP_NAME}
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
          <p className="mb-2 truncate text-xs text-muted-foreground">{user?.email}</p>
          <button
            onClick={() => {
              clearAuth();
              window.location.href = '/login';
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b border-white/10 px-6 lg:hidden">
          <button onClick={() => setMobileOpen(true)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="font-semibold">{APP_NAME}</span>
        </header>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
