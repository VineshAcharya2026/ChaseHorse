'use client';

import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { KpiCard, PageHeader, EmptyState } from '@/components/dashboard/kpi-card';
import { api, useAuthStore } from '@chasehorse/auth-client';
import { Building2, Users, Package, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AdminDashboard() {
  return (
    <AuthGuard allowedRoles={['super_admin']}>
      <AdminDashboardContent />
    </AuthGuard>
  );
}

function AdminDashboardContent() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => api.get<{ success: boolean; data: { kpis: Record<string, number>; revenueTrend: { month: string; revenue: number }[] } }>('/api/analytics/super-admin'),
  });

  const kpis = data?.data?.kpis;

  return (
    <div>
      <PageHeader title="Super Admin Dashboard" description="Platform-wide overview" />
      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg border border-border bg-muted/30" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState title="Unable to load analytics" description="Check your connection and try again." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard title="Revenue" value={`₹${(kpis?.revenue ?? 0).toLocaleString()}`} icon={TrendingUp} />
          <KpiCard title="Companies" value={kpis?.companies ?? 0} icon={Building2} />
          <KpiCard title="Drivers" value={kpis?.drivers ?? 0} icon={Users} />
          <KpiCard title="Deliveries" value={kpis?.deliveries ?? 0} change={`${kpis?.successRate ?? 0}% success`} icon={Package} />
        </div>
      )}
      {data?.data?.revenueTrend && (
        <div className="mt-6 rounded-lg border border-border p-4">
          <h3 className="mb-3 text-sm font-semibold">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data.data.revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ background: '#111', border: '1px solid #333' }} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(210,100%,50%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
