'use client';

import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { KpiCard, PageHeader } from '@/components/dashboard/kpi-card';
import { api, useAuthStore } from '@chasehorse/auth-client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, TrendingUp, Users, AlertTriangle } from 'lucide-react';

export default function AdminAnalyticsPage() {
  return (
    <AuthGuard allowedRoles={['super_admin']}>
      <AdminAnalyticsContent />
    </AuthGuard>
  );
}

function AdminAnalyticsContent() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);

  const { data } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => api.get<{ success: boolean; data: { kpis: Record<string, number>; deliveryTrend: { month: string; deliveries: number }[] } }>('/api/analytics/super-admin'),
  });

  return (
    <div>
      <PageHeader title="Analytics" description="Platform performance metrics" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Deliveries" value={data?.data?.kpis?.deliveries ?? 0} icon={Package} />
        <KpiCard title="Revenue" value={`₹${(data?.data?.kpis?.revenue ?? 0).toLocaleString()}`} icon={TrendingUp} />
        <KpiCard title="Companies" value={data?.data?.kpis?.companies ?? 0} icon={Users} />
        <KpiCard title="Success Rate" value={`${data?.data?.kpis?.successRate ?? 0}%`} icon={AlertTriangle} />
      </div>
      {data?.data?.deliveryTrend && (
        <div className="mt-8 rounded-xl border border-white/10 p-6">
          <h3 className="mb-4 font-semibold">Delivery Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.data.deliveryTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ background: '#111', border: '1px solid #333' }} />
              <Bar dataKey="deliveries" fill="hsl(210,100%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
