import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { uploadBase64Image } from '../lib/storage';
import { generateId } from '../lib/auth';
import type { Env, Variables } from '../types';

const uploadsRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

uploadsRouter.post('/', authMiddleware, async (c) => {
  const body = await c.req.json<{ data: string; folder?: string; contentType?: string }>();
  const folder = body.folder ?? 'uploads';
  const key = `${folder}/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${generateId()}.png`;
  await uploadBase64Image(c.env.STORAGE, key, body.data, body.contentType ?? 'image/png');
  const baseUrl = c.env.R2_PUBLIC_URL ?? new URL(c.req.url).origin;
  return c.json({ success: true, data: { key, url: `${baseUrl}/api/files/${encodeURIComponent(key)}` } });
});

export { uploadsRouter };
