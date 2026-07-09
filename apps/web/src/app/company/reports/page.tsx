'use client';

import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { KpiCard, PageHeader } from '@/components/dashboard/kpi-card';
import { api, useAuthStore } from '@chasehorse/auth-client';
import { Package, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CompanyReportsPage() {
  return (
    <AuthGuard allowedRoles={['company_admin']}>
      <ReportsContent />
    </AuthGuard>
  );
}

function ReportsContent() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);

  const { data } = useQuery({
    queryKey: ['company-analytics'],
    queryFn: () => api.get<{ success: boolean; data: { kpis: Record<string, number>; deliveryTrend: { day: string; count: number }[] } }>('/api/analytics/company'),
  });

  const kpis = data?.data?.kpis;

  return (
    <div>
      <PageHeader title="Reports" description="Company analytics and reports" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Daily Deliveries" value={kpis?.dailyDeliveries ?? 0} icon={Package} />
        <KpiCard title="Revenue" value={`₹${(kpis?.revenue ?? 0).toLocaleString()}`} icon={TrendingUp} />
        <KpiCard title="Driver Efficiency" value={`${kpis?.driverEfficiency ?? 0}%`} icon={Users} />
        <KpiCard title="Failed Deliveries" value={kpis?.failedDeliveries ?? 0} icon={AlertTriangle} />
      </div>
      {data?.data?.deliveryTrend && (
        <div className="mt-8 rounded-xl border border-border p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.data.deliveryTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ background: '#111', border: '1px solid #333' }} />
              <Bar dataKey="count" fill="hsl(210,100%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
