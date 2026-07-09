import type { Context } from 'hono';
import { logAudit } from '../routes/analytics';
import type { Env, Variables } from '../types';

export async function audit(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  action: string,
  resource: string,
  resourceId?: string,
  metadata?: Record<string, unknown>,
  actorId?: string,
) {
  await logAudit(c.env, {
    actorId: actorId ?? (c.get('userId') as string | undefined) ?? 'system',
    companyId: c.get('companyId') ?? undefined,
    action,
    resource,
    resourceId,
    ip: c.req.header('CF-Connecting-IP') ?? undefined,
    metadata,
  });
}
