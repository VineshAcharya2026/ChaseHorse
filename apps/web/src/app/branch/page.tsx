'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { KpiCard, PageHeader } from '@/components/dashboard/kpi-card';
import { Package, Users, Warehouse, BarChart3 } from 'lucide-react';

export default function BranchDashboard() {
  return (
    <AuthGuard allowedRoles={['branch_manager']}>
      <div>
        <PageHeader title="Branch Dashboard" description="Branch operations overview" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard title="Active Shipments" value={24} icon={Package} />
          <KpiCard title="Drivers On Duty" value={8} icon={Users} />
          <KpiCard title="Warehouse Capacity" value="72%" icon={Warehouse} />
          <KpiCard title="Today Deliveries" value={45} icon={BarChart3} />
        </div>
      </div>
    </AuthGuard>
  );
}
