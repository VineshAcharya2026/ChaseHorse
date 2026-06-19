'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';
import { Button } from '@/components/ui/button';
import { Package, MapPin, Clock } from 'lucide-react';

const tasks = [
  { id: '1', awb: 'CHABC123', type: 'Pickup', address: '456 MG Road, Bangalore', status: 'assigned', time: '10:30 AM' },
  { id: '2', awb: 'CHDEF456', type: 'Delivery', address: '789 Residency Road, Bangalore', status: 'in_progress', time: '11:00 AM' },
  { id: '3', awb: 'CHGHI789', type: 'Delivery', address: '321 Brigade Road, Bangalore', status: 'pending', time: '12:00 PM' },
];

export default function DriverDashboard() {
  return (
    <AuthGuard allowedRoles={['driver']}>
      <div>
        <PageHeader title="My Tasks" description="Today's pickups and deliveries" />
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="rounded-xl border border-white/10 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="font-medium">{task.awb}</span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{task.type}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {task.address}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" /> {task.time}
                  </div>
                </div>
                <Button size="sm">{task.status === 'pending' ? 'Accept' : 'Navigate'}</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
