import { createMiddleware } from 'hono/factory';
import { verifyToken } from '../lib/auth';
import type { Env, Variables } from '../types';

export const authMiddleware = createMiddleware<{ Bindings: Env; Variables: Variables }>(
  async (c, next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    try {
      const token = authHeader.slice(7);
      const payload = await verifyToken(token, c.env.JWT_SECRET);
      c.set('userId', payload.sub);
      c.set('userRole', payload.role);
      c.set('companyId', payload.companyId ?? null);
      c.set('branchId', payload.branchId ?? null);
      await next();
    } catch {
      return c.json({ success: false, error: 'Invalid token' }, 401);
    }
  },
);

export function requireRoles(...roles: string[]) {
  return createMiddleware<{ Bindings: Env; Variables: Variables }>(async (c, next) => {
    const role = c.get('userRole');
    if (!roles.includes(role)) {
      return c.json({ success: false, error: 'Forbidden' }, 403);
    }
    await next();
  });
}

export const rateLimitMiddleware = createMiddleware<{ Bindings: Env }>(async (c, next) => {
  const ip = c.req.header('CF-Connecting-IP') ?? 'unknown';
  const key = `rate:${ip}:${c.req.path}`;
  const limit = 100;
  const window = 60;

  const current = await c.env.CACHE.get(key);
  const count = current ? parseInt(current, 10) : 0;

  if (count >= limit) {
    return c.json({ success: false, error: 'Rate limit exceeded' }, 429);
  }

  await c.env.CACHE.put(key, String(count + 1), { expirationTtl: window });
  await next();
});
