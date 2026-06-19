'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', deliveries: 45 }, { day: 'Tue', deliveries: 52 },
  { day: 'Wed', deliveries: 48 }, { day: 'Thu', deliveries: 61 },
  { day: 'Fri', deliveries: 55 },
];

export default function BranchAnalyticsPage() {
  return (
    <AuthGuard allowedRoles={['branch_manager']}>
      <div>
        <PageHeader title="Branch Analytics" />
        <div className="rounded-xl border border-white/10 p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ background: '#111', border: '1px solid #333' }} />
              <Bar dataKey="deliveries" fill="hsl(210,100%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AuthGuard>
  );
}
