import { Hono } from 'hono';
import { eq, desc, sql } from 'drizzle-orm';
import { createDb, companies, branches } from '@chasehorse/database';
import { generateId } from '../lib/auth';
import { authMiddleware, requireRoles } from '../middleware/auth';
import { audit } from '../lib/audit-helper';
import type { Env, Variables } from '../types';

const companiesRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

companiesRouter.use('*', authMiddleware);

companiesRouter.get('/', requireRoles('super_admin'), async (c) => {
  const db = createDb(c.env.DB);
  const page = parseInt(c.req.query('page') ?? '1', 10);
  const pageSize = parseInt(c.req.query('pageSize') ?? '20', 10);
  const offset = (page - 1) * pageSize;

  const items = await db
    .select()
    .from(companies)
    .orderBy(desc(companies.createdAt))
    .limit(pageSize)
    .offset(offset)
    .all();

  const countResult = await db.select({ count: sql<number>`count(*)` }).from(companies).get();

  return c.json({
    success: true,
    data: { items, total: countResult?.count ?? 0, page, pageSize },
  });
});

companiesRouter.get('/:id', async (c) => {
  const db = createDb(c.env.DB);
  const company = await db.select().from(companies).where(eq(companies.id, c.req.param('id'))).get();
  if (!company) return c.json({ success: false, error: 'Not found' }, 404);

  const role = c.get('userRole');
  if (role !== 'super_admin' && c.get('companyId') !== company.id) {
    return c.json({ success: false, error: 'Forbidden' }, 403);
  }

  return c.json({ success: true, data: company });
});

companiesRouter.post('/', requireRoles('super_admin'), async (c) => {
  const body = await c.req.json();
  const db = createDb(c.env.DB);
  const id = generateId();

  await db.insert(companies).values({
    id,
    name: body.name,
    gstNumber: body.gstNumber,
    address: body.address,
    city: body.city,
    state: body.state,
    pincode: body.pincode,
    phone: body.phone,
    email: body.email,
    subscriptionTier: body.subscriptionTier ?? 'starter',
    status: 'active',
  });

  const company = await db.select().from(companies).where(eq(companies.id, id)).get();
  await audit(c, 'create', 'company', id);
  return c.json({ success: true, data: company }, 201);
});

companiesRouter.put('/:id', async (c) => {
  const body = await c.req.json();
  const db = createDb(c.env.DB);
  const id = c.req.param('id');

  const role = c.get('userRole');
  if (role !== 'super_admin' && c.get('companyId') !== id) {
    return c.json({ success: false, error: 'Forbidden' }, 403);
  }

  await db
    .update(companies)
    .set({ ...body, updatedAt: new Date().toISOString() })
    .where(eq(companies.id, id));

  const company = await db.select().from(companies).where(eq(companies.id, id)).get();
  await audit(c, 'update', 'company', id);
  return c.json({ success: true, data: company });
});

companiesRouter.patch('/:id/suspend', requireRoles('super_admin'), async (c) => {
  const db = createDb(c.env.DB);
  const id = c.req.param('id');
  await db.update(companies).set({ status: 'suspended', updatedAt: new Date().toISOString() }).where(eq(companies.id, id));
  return c.json({ success: true, message: 'Company suspended' });
});

companiesRouter.delete('/:id', requireRoles('super_admin'), async (c) => {
  const db = createDb(c.env.DB);
  await db.update(companies).set({ status: 'deleted', updatedAt: new Date().toISOString() }).where(eq(companies.id, c.req.param('id')));
  return c.json({ success: true, message: 'Company deleted' });
});

const branchesRouter = new Hono<{ Bindings: Env; Variables: Variables }>();
branchesRouter.use('*', authMiddleware);

branchesRouter.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const companyId = c.req.query('companyId') ?? c.get('companyId');
  if (!companyId) return c.json({ success: false, error: 'companyId required' }, 400);

  const items = await db.select().from(branches).where(eq(branches.companyId, companyId)).all();
  return c.json({ success: true, data: items });
});

branchesRouter.post('/', requireRoles('super_admin', 'company_admin'), async (c) => {
  const body = await c.req.json();
  const db = createDb(c.env.DB);
  const id = generateId();
  const companyId = body.companyId ?? c.get('companyId');

  if (!companyId) return c.json({ success: false, error: 'companyId required' }, 400);

  await db.insert(branches).values({
    id,
    companyId,
    name: body.name,
    address: body.address,
    city: body.city,
    state: body.state,
    pincode: body.pincode,
    phone: body.phone,
    managerId: body.managerId,
  });

  const branch = await db.select().from(branches).where(eq(branches.id, id)).get();
  return c.json({ success: true, data: branch }, 201);
});

branchesRouter.put('/:id', requireRoles('super_admin', 'company_admin', 'branch_manager'), async (c) => {
  const body = await c.req.json();
  const db = createDb(c.env.DB);
  await db.update(branches).set({ ...body, updatedAt: new Date().toISOString() }).where(eq(branches.id, c.req.param('id')));
  const branch = await db.select().from(branches).where(eq(branches.id, c.req.param('id'))).get();
  return c.json({ success: true, data: branch });
});

export { companiesRouter, branchesRouter };
