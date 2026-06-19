'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { KpiCard, PageHeader } from '@/components/dashboard/kpi-card';
import { Package, Key, Users, BarChart3 } from 'lucide-react';

export default function EnterpriseDashboard() {
  return (
    <AuthGuard allowedRoles={['enterprise_user']}>
      <div>
        <PageHeader title="Enterprise Dashboard" description="Bulk operations and API management" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard title="Monthly Shipments" value="2,450" icon={Package} />
          <KpiCard title="API Calls" value="45.2K" icon={Key} />
          <KpiCard title="Team Members" value={12} icon={Users} />
          <KpiCard title="Success Rate" value="98.5%" icon={BarChart3} />
        </div>
      </div>
    </AuthGuard>
  );
}
