import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import * as OTPAuth from 'otpauth';
import { createDb, users, refreshTokens, userCompanyRoles } from '@chasehorse/database';
import {
  signAccessToken,
  signRefreshToken,
  verifyPassword,
  hashPassword,
  generateId,
  hashToken,
} from '../lib/auth';
import { authMiddleware } from '../middleware/auth';
import type { Env, Variables } from '../types';

const auth = new Hono<{ Bindings: Env; Variables: Variables }>();

auth.post('/register', async (c) => {
  const body = await c.req.json<{ email: string; password: string; name: string; phone?: string }>();
  const db = createDb(c.env.DB);

  const existing = await db.select().from(users).where(eq(users.email, body.email)).get();
  if (existing) return c.json({ success: false, error: 'Email already registered' }, 400);

  const userId = generateId();
  const passwordHash = await hashPassword(body.password);

  await db.insert(users).values({
    id: userId,
    email: body.email,
    name: body.name,
    phone: body.phone,
    passwordHash,
    role: 'customer',
  });

  const accessToken = await signAccessToken(
    { sub: userId, email: body.email, role: 'customer', companyId: null, branchId: null },
    c.env.JWT_SECRET,
  );

  return c.json({
    success: true,
    data: {
      user: { sub: userId, email: body.email, role: 'customer' },
      accessToken,
    },
  });
});

auth.post('/login', async (c) => {
  const body = await c.req.json<{ email: string; password: string }>();
  const db = createDb(c.env.DB);

  const user = await db.select().from(users).where(eq(users.email, body.email)).get();
  if (!user || !user.passwordHash) {
    return c.json({ success: false, error: 'Invalid credentials' }, 401);
  }

  const valid = await verifyPassword(body.password, user.passwordHash);
  if (!valid) return c.json({ success: false, error: 'Invalid credentials' }, 401);

  const roleRecord = await db
    .select()
    .from(userCompanyRoles)
    .where(eq(userCompanyRoles.userId, user.id))
    .get();

  const accessToken = await signAccessToken(
    {
      sub: user.id,
      email: user.email,
      role: user.role as 'customer',
      companyId: roleRecord?.companyId ?? null,
      branchId: roleRecord?.branchId ?? null,
    },
    c.env.JWT_SECRET,
  );

  const refreshToken = await signRefreshToken(user.id, c.env.JWT_REFRESH_SECRET);
  await db.insert(refreshTokens).values({
    id: generateId(),
    userId: user.id,
    tokenHash: await hashToken(refreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  });

  await db
    .update(users)
    .set({
      lastLoginAt: new Date().toISOString(),
      lastLoginIp: c.req.header('CF-Connecting-IP') ?? undefined,
    })
    .where(eq(users.id, user.id));

  return c.json({
    success: true,
    data: {
      user: {
        sub: user.id,
        email: user.email,
        role: user.role,
        companyId: roleRecord?.companyId ?? null,
        branchId: roleRecord?.branchId ?? null,
      },
      accessToken,
      refreshToken,
    },
  });
});

auth.post('/logout', authMiddleware, async (c) => {
  return c.json({ success: true, message: 'Logged out' });
});

auth.post('/otp/request', async (c) => {
  const { phone } = await c.req.json<{ phone: string }>();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await c.env.CACHE.put(`otp:${phone}`, otp, { expirationTtl: 300 });
  return c.json({ success: true, message: 'OTP sent', data: { phone } });
});

auth.post('/otp/verify', async (c) => {
  const { phone, otp } = await c.req.json<{ phone: string; otp: string }>();
  const stored = await c.env.CACHE.get(`otp:${phone}`);
  if (!stored || stored !== otp) {
    return c.json({ success: false, error: 'Invalid OTP' }, 401);
  }

  const db = createDb(c.env.DB);
  let user = await db.select().from(users).where(eq(users.phone, phone)).get();

  if (!user) {
    const userId = generateId();
    await db.insert(users).values({
      id: userId,
      email: `${phone}@phone.chasehorse.com`,
      phone,
      name: `User ${phone.slice(-4)}`,
      role: 'customer',
    });
    user = await db.select().from(users).where(eq(users.id, userId)).get();
  }

  if (!user) return c.json({ success: false, error: 'User creation failed' }, 500);

  const accessToken = await signAccessToken(
    { sub: user.id, email: user.email, role: user.role as 'customer', companyId: null, branchId: null },
    c.env.JWT_SECRET,
  );

  await c.env.CACHE.delete(`otp:${phone}`);
  return c.json({
    success: true,
    data: { user: { sub: user.id, email: user.email, role: user.role }, accessToken },
  });
});

auth.get('/me', authMiddleware, async (c) => {
  const db = createDb(c.env.DB);
  const userId = c.get('userId');
  const user = await db.select().from(users).where(eq(users.id, userId)).get();
  if (!user) return c.json({ success: false, error: 'User not found' }, 404);

  return c.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      mfaEnabled: user.mfaEnabled,
      companyId: c.get('companyId'),
      branchId: c.get('branchId'),
    },
  });
});

auth.post('/mfa/setup', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const totp = new OTPAuth.TOTP({
    issuer: 'ChaseHorse',
    label: userId,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromUTF8(crypto.randomUUID()),
  });

  await c.env.CACHE.put(`mfa:setup:${userId}`, totp.secret.base32, { expirationTtl: 600 });

  return c.json({
    success: true,
    data: { secret: totp.secret.base32, uri: totp.toString() },
  });
});

auth.post('/mfa/verify', authMiddleware, async (c) => {
  const { code } = await c.req.json<{ code: string }>();
  const userId = c.get('userId');
  const secret = await c.env.CACHE.get(`mfa:setup:${userId}`);
  if (!secret) return c.json({ success: false, error: 'MFA setup not initiated' }, 400);

  const totp = new OTPAuth.TOTP({
    issuer: 'ChaseHorse',
    label: userId,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  });

  const delta = totp.validate({ token: code, window: 1 });
  if (delta === null) return c.json({ success: false, error: 'Invalid code' }, 400);

  const db = createDb(c.env.DB);
  await db.update(users).set({ mfaEnabled: true, mfaSecret: secret }).where(eq(users.id, userId));

  return c.json({ success: true, message: 'MFA enabled' });
});

auth.get('/oauth/:provider', async (c) => {
  const provider = c.req.param('provider');
  const redirectUri = `${c.env.FRONTEND_URL}/auth/callback/${provider}`;
  const state = crypto.randomUUID();
  await c.env.CACHE.put(`oauth:state:${state}`, provider, { expirationTtl: 600 });

  const urls: Record<string, string> = {
    google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${c.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email%20profile&state=${state}`,
    microsoft: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${c.env.MICROSOFT_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile&state=${state}`,
    linkedin: `https://www.linkedin.com/oauth/v2/authorization?client_id=${c.env.LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=r_liteprofile%20r_emailaddress&state=${state}`,
  };

  const url = urls[provider];
  if (!url) return c.json({ success: false, error: 'Unknown provider' }, 400);
  return c.redirect(url);
});

auth.post('/oauth/:provider/callback', async (c) => {
  const provider = c.req.param('provider');
  const { code, state } = await c.req.json<{ code: string; state: string }>();

  const storedProvider = await c.env.CACHE.get(`oauth:state:${state}`);
  if (storedProvider !== provider) {
    return c.json({ success: false, error: 'Invalid state' }, 400);
  }

  const db = createDb(c.env.DB);
  const userId = generateId();
  const email = `${provider}_user@oauth.chasehorse.com`;

  let user = await db.select().from(users).where(eq(users.oauthProvider, provider)).get();
  if (!user) {
    await db.insert(users).values({
      id: userId,
      email,
      name: `${provider} User`,
      role: 'customer',
      oauthProvider: provider,
      oauthId: code.slice(0, 20),
    });
    user = await db.select().from(users).where(eq(users.id, userId)).get();
  }

  if (!user) return c.json({ success: false, error: 'OAuth failed' }, 500);

  const accessToken = await signAccessToken(
    { sub: user.id, email: user.email, role: user.role as 'customer', companyId: null, branchId: null },
    c.env.JWT_SECRET,
  );

  return c.json({
    success: true,
    data: { user: { sub: user.id, email: user.email, role: user.role }, accessToken },
  });
});

export default auth;
