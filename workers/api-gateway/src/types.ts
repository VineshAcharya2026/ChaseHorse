import type { D1Database, KVNamespace, Queue, R2Bucket } from '@cloudflare/workers-types';

export interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
  STORAGE: R2Bucket;
  NOTIFICATION_QUEUE: Queue;
  WEBHOOK_QUEUE: Queue;
  AUDIT_QUEUE: Queue;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  MICROSOFT_CLIENT_ID?: string;
  MICROSOFT_CLIENT_SECRET?: string;
  LINKEDIN_CLIENT_ID?: string;
  LINKEDIN_CLIENT_SECRET?: string;
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
  SENDGRID_API_KEY?: string;
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  FRONTEND_URL: string;
  TRACKING: DurableObjectNamespace;
}

export interface Variables {
  userId: string;
  userRole: string;
  companyId: string | null;
  branchId: string | null;
}
