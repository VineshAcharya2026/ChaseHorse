import { Hono } from 'hono';
import { eq, desc, sql } from 'drizzle-orm';
import { createDb, cmsAssets, cmsContent, cmsRevisions } from '@chasehorse/database';
import { generateId } from '../lib/auth';
import { authMiddleware, requireRoles } from '../middleware/auth';
import { uploadBase64Image } from '../lib/storage';
import type { Env, Variables } from '../types';

const cmsRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

const SITE_SLUG = 'site';

function publicUrlFor(c: { env: Env; req: { url: string } }, key: string): string {
  const baseUrl = c.env.R2_PUBLIC_URL ?? new URL(c.req.url).origin;
  return `${baseUrl}/api/files/${encodeURIComponent(key)}`;
}

// --- Public: marketing site reads content at runtime (cacheable) ---
cmsRouter.get('/public/site', async (c) => {
  const db = createDb(c.env.DB);
  const row = await db.select().from(cmsContent).where(eq(cmsContent.slug, SITE_SLUG)).get();

  if (!row) {
    // No CMS content yet — marketing falls back to its bundled site.json.
    return c.json({ success: true, data: null });
  }

  c.header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  let payload: unknown;
  try {
    payload = JSON.parse(row.payload);
  } catch {
    payload = null;
  }
  return c.json({ success: true, data: payload, version: row.version });
});

// All routes below require super_admin.
cmsRouter.use('/content', authMiddleware, requireRoles('super_admin'));
cmsRouter.use('/content/*', authMiddleware, requireRoles('super_admin'));
cmsRouter.use('/assets', authMiddleware, requireRoles('super_admin'));
cmsRouter.use('/assets/*', authMiddleware, requireRoles('super_admin'));

// --- Content CRUD ---
cmsRouter.get('/content', async (c) => {
  const db = createDb(c.env.DB);
  const row = await db.select().from(cmsContent).where(eq(cmsContent.slug, SITE_SLUG)).get();
  if (!row) return c.json({ success: true, data: null });
  let payload: unknown;
  try {
    payload = JSON.parse(row.payload);
  } catch {
    payload = null;
  }
  return c.json({ success: true, data: payload, version: row.version });
});

cmsRouter.put('/content', async (c) => {
  const db = createDb(c.env.DB);
  const userId = c.get('userId');
  const body = await c.req.json<{ payload: unknown }>();
  const serialized = JSON.stringify(body.payload);

  const existing = await db.select().from(cmsContent).where(eq(cmsContent.slug, SITE_SLUG)).get();

  if (existing) {
    const nextVersion = existing.version + 1;
    await db.insert(cmsRevisions).values({
      id: generateId(),
      slug: SITE_SLUG,
      payload: existing.payload,
      version: existing.version,
      updatedBy: userId,
    });
    await db
      .update(cmsContent)
      .set({
        payload: serialized,
        version: nextVersion,
        updatedBy: userId,
        updatedAt: sql`(datetime('now'))`,
      })
      .where(eq(cmsContent.slug, SITE_SLUG));
    return c.json({ success: true, data: { version: nextVersion } });
  }

  await db.insert(cmsContent).values({
    id: generateId(),
    slug: SITE_SLUG,
    payload: serialized,
    version: 1,
    updatedBy: userId,
  });
  return c.json({ success: true, data: { version: 1 } });
});

// --- Asset library ---
cmsRouter.get('/assets', async (c) => {
  const db = createDb(c.env.DB);
  const folder = c.req.query('folder');
  const page = parseInt(c.req.query('page') ?? '1', 10);
  const pageSize = parseInt(c.req.query('pageSize') ?? '60', 10);
  const offset = (page - 1) * pageSize;

  const rows = folder
    ? await db
        .select()
        .from(cmsAssets)
        .where(eq(cmsAssets.folder, folder))
        .orderBy(desc(cmsAssets.createdAt))
        .limit(pageSize)
        .offset(offset)
        .all()
    : await db
        .select()
        .from(cmsAssets)
        .orderBy(desc(cmsAssets.createdAt))
        .limit(pageSize)
        .offset(offset)
        .all();

  const countResult = await db.select({ count: sql<number>`count(*)` }).from(cmsAssets).get();

  return c.json({
    success: true,
    data: { items: rows, total: countResult?.count ?? 0, page, pageSize },
  });
});

cmsRouter.post('/assets', async (c) => {
  if (!c.env.STORAGE) return c.json({ success: false, error: 'Storage not configured' }, 503);
  const db = createDb(c.env.DB);
  const userId = c.get('userId');
  const body = await c.req.json<{
    data: string;
    filename: string;
    folder?: string;
    contentType?: string;
    altText?: string;
  }>();

  const folder = body.folder ?? 'images';
  const contentType = body.contentType ?? 'image/png';
  const ext = (body.filename.split('.').pop() ?? 'png').toLowerCase();
  const id = generateId();
  const key = `cms/${folder}/${id}.${ext}`;

  await uploadBase64Image(c.env.STORAGE, key, body.data, contentType);
  const url = publicUrlFor(c, key);
  const raw = body.data.includes(',') ? body.data.split(',')[1]! : body.data;
  const sizeBytes = Math.floor((raw.length * 3) / 4);

  await db.insert(cmsAssets).values({
    id,
    key,
    url,
    folder,
    mimeType: contentType,
    filename: body.filename,
    altText: body.altText ?? null,
    sizeBytes,
    uploadedBy: userId,
  });

  const asset = await db.select().from(cmsAssets).where(eq(cmsAssets.id, id)).get();
  return c.json({ success: true, data: asset });
});

cmsRouter.put('/assets/:id', async (c) => {
  const db = createDb(c.env.DB);
  const id = c.req.param('id');
  const body = await c.req.json<{ altText?: string; filename?: string }>();
  const existing = await db.select().from(cmsAssets).where(eq(cmsAssets.id, id)).get();
  if (!existing) return c.json({ success: false, error: 'Not found' }, 404);

  await db
    .update(cmsAssets)
    .set({
      altText: body.altText ?? existing.altText,
      filename: body.filename ?? existing.filename,
      updatedAt: sql`(datetime('now'))`,
    })
    .where(eq(cmsAssets.id, id));

  const updated = await db.select().from(cmsAssets).where(eq(cmsAssets.id, id)).get();
  return c.json({ success: true, data: updated });
});

// Overwrite the file in-place so the existing URL keeps working (slot replacement).
cmsRouter.post('/assets/:id/replace', async (c) => {
  if (!c.env.STORAGE) return c.json({ success: false, error: 'Storage not configured' }, 503);
  const db = createDb(c.env.DB);
  const id = c.req.param('id');
  const body = await c.req.json<{ data: string; contentType?: string; filename?: string }>();
  const existing = await db.select().from(cmsAssets).where(eq(cmsAssets.id, id)).get();
  if (!existing) return c.json({ success: false, error: 'Not found' }, 404);

  const contentType = body.contentType ?? existing.mimeType;
  await uploadBase64Image(c.env.STORAGE, existing.key, body.data, contentType);
  const raw = body.data.includes(',') ? body.data.split(',')[1]! : body.data;
  const sizeBytes = Math.floor((raw.length * 3) / 4);

  await db
    .update(cmsAssets)
    .set({
      mimeType: contentType,
      filename: body.filename ?? existing.filename,
      sizeBytes,
      updatedAt: sql`(datetime('now'))`,
    })
    .where(eq(cmsAssets.id, id));

  const updated = await db.select().from(cmsAssets).where(eq(cmsAssets.id, id)).get();
  return c.json({ success: true, data: updated });
});

cmsRouter.delete('/assets/:id', async (c) => {
  const db = createDb(c.env.DB);
  const id = c.req.param('id');
  const existing = await db.select().from(cmsAssets).where(eq(cmsAssets.id, id)).get();
  if (!existing) return c.json({ success: false, error: 'Not found' }, 404);

  if (c.env.STORAGE) {
    try {
      await c.env.STORAGE.delete(existing.key);
    } catch {
      // ignore storage delete failures; still remove metadata
    }
  }
  await db.delete(cmsAssets).where(eq(cmsAssets.id, id));
  return c.json({ success: true });
});

export { cmsRouter };
