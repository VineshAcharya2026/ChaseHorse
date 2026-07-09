'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', shipments: 1800 }, { month: 'Feb', shipments: 2100 },
  { month: 'Mar', shipments: 2450 }, { month: 'Apr', shipments: 2300 },
];

export default function EnterpriseReportsPage() {
  return (
    <AuthGuard allowedRoles={['enterprise_user']}>
      <div>
        <PageHeader title="Reports" description="Enterprise shipment analytics" />
        <div className="rounded-xl border border-border p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ background: '#111', border: '1px solid #333' }} />
              <Bar dataKey="shipments" fill="hsl(210,100%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AuthGuard>
  );
}
