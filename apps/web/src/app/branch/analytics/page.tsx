'use client';

import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader, KpiCard } from '@/components/dashboard/kpi-card';
import { api, useAuthStore } from '@chasehorse/auth-client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, TrendingUp, Users, AlertTriangle } from 'lucide-react';

export default function BranchAnalyticsPage() {
  return (
    <AuthGuard allowedRoles={['branch_manager']}>
      <AnalyticsContent />
    </AuthGuard>
  );
}

function AnalyticsContent() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);

  const { data, isLoading } = useQuery({
    queryKey: ['branch-analytics'],
    queryFn: () =>
      api.get<{
        success: boolean;
        data: {
          kpis: { dailyDeliveries: number; revenue: number; driverEfficiency: number; failedDeliveries: number };
          deliveryTrend: Array<{ day: string; count: number }>;
        };
      }>('/api/analytics/company'),
  });

  const kpis = data?.data?.kpis;
  const chartData = data?.data?.deliveryTrend ?? [];

  return (
    <div>
      <PageHeader title="Branch Analytics" />
      {isLoading ? (
        <div className="h-64 animate-pulse rounded-xl bg-muted/40" />
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard title="Daily Deliveries" value={kpis?.dailyDeliveries ?? 0} icon={Package} />
            <KpiCard title="Revenue" value={`₹${kpis?.revenue ?? 0}`} icon={TrendingUp} />
            <KpiCard title="Driver Efficiency" value={`${kpis?.driverEfficiency ?? 0}%`} icon={Users} />
            <KpiCard title="Failed Deliveries" value={kpis?.failedDeliveries ?? 0} icon={AlertTriangle} />
          </div>
          <div className="rounded-xl border border-border p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ background: '#111', border: '1px solid #333' }} />
                <Bar dataKey="count" fill="hsl(210,100%,50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
