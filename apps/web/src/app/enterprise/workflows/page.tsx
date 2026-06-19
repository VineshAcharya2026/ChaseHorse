'use client';

import { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';
import { Button } from '@/components/ui/button';
import { api, useAuthStore } from '@chasehorse/auth-client';

const initialNodes: Node[] = [
  { id: '1', position: { x: 250, y: 0 }, data: { label: 'New Order Created' }, type: 'input', style: { background: '#1a1a2e', color: '#fff', border: '1px solid #333' } },
  { id: '2', position: { x: 250, y: 100 }, data: { label: 'Create Shipment' }, style: { background: '#1a1a2e', color: '#fff', border: '1px solid #333' } },
  { id: '3', position: { x: 100, y: 200 }, data: { label: 'Assign Driver' }, style: { background: '#1a1a2e', color: '#fff', border: '1px solid #333' } },
  { id: '4', position: { x: 400, y: 200 }, data: { label: 'Send WhatsApp' }, style: { background: '#1a1a2e', color: '#fff', border: '1px solid #333' } },
  { id: '5', position: { x: 250, y: 300 }, data: { label: 'Generate Invoice' }, style: { background: '#1a1a2e', color: '#fff', border: '1px solid #333' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-5', source: '3', target: '5' },
  { id: 'e4-5', source: '4', target: '5' },
];

export default function WorkflowsPage() {
  return (
    <AuthGuard allowedRoles={['enterprise_user', 'company_admin']}>
      <WorkflowBuilder />
    </AuthGuard>
  );
}

function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleSave = async () => {
    const steps = nodes
      .filter((n) => n.id !== '1')
      .map((n) => ({ action: String(n.data.label).toLowerCase().replace(/ /g, '_'), config: {} }));

    await api.post('/api/workflows', {
      name: 'Order Fulfillment',
      trigger: 'order.created',
      steps,
      enabled: true,
    });
    alert('Workflow saved!');
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <PageHeader title="Workflow Builder" description="No-code automation" />
        <Button onClick={handleSave}>Save Workflow</Button>
      </div>
      <div className="h-[600px] rounded-xl border border-white/10">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background color="#333" gap={16} />
          <Controls />
          <MiniMap nodeColor="#1a1a2e" />
        </ReactFlow>
      </div>
    </div>
  );
}
