# ChaseHorse

**Move Faster. Deliver Smarter.**

Enterprise Logistics, Courier & Fleet Management Platform — V1.0

## Architecture

Cloudflare-first monorepo:

- **Frontend:** Next.js 15 on Cloudflare Pages (`apps/web`)
- **API:** Hono on Cloudflare Workers (`workers/api-gateway`)
- **Database:** Cloudflare D1 (SQLite) with Drizzle ORM
- **Storage:** Cloudflare R2
- **Cache:** Cloudflare KV
- **Queues:** Cloudflare Queues (notifications, webhooks, audit)
- **Real-time:** Durable Objects (shipment tracking)

## Monorepo Structure

```
chasehorse/
├── apps/web/           # Next.js frontend (all role dashboards)
├── workers/api-gateway/ # Hono API (all modules)
├── packages/
│   ├── shared/         # Types, schemas, constants
│   ├── database/       # Drizzle schema & migrations
│   ├── core/           # Business logic
│   ├── auth-client/    # Frontend auth & API client
│   └── integrations-sdk/ # CRM/ERP connectors
└── .github/workflows/  # CI/CD
```

## Marketing Site

**Local:** http://localhost:3001 (marketing) · http://localhost:3000 (SaaS app)

**Production:**
- Marketing: https://chasehorse-marketing-8ic.pages.dev
- Web app: https://chasehorse-app.pages.dev
- API: https://chasehorse-api.vineshjm.workers.dev

```bash
# Start both sites
pnpm dev

# Marketing only (port 3001)
pnpm dev:marketing

# SaaS app only (port 3000)
pnpm dev:web

# Re-extract content from chasehorse.odoo.com
pnpm extract:odoo
```

> **Note:** The marketing site runs on port **3001**, not 3000. First load in dev may take 30–60 seconds while Next.js compiles.

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- Cloudflare account (for deployment)

### Install

```bash
pnpm install
```

### Environment

For local development, copy `.env.example` to `apps/web/.env.development.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8787
NEXT_PUBLIC_MAPS_API_KEY=your-google-maps-key
```

Production builds use `apps/web/.env.production` (already configured for Cloudflare Pages).

For the API worker, create `workers/api-gateway/.dev.vars`:

```
JWT_SECRET=your-jwt-secret-min-32-chars-long!!
JWT_REFRESH_SECRET=your-refresh-secret-min-32!!
FRONTEND_URL=http://localhost:3000
AWB_PREFIX=CH
```

### Production secrets (Cloudflare Worker)

Set via `wrangler secret put` in `workers/api-gateway`:

| Secret | Purpose |
|--------|---------|
| `JWT_SECRET` | Access token signing |
| `JWT_REFRESH_SECRET` | Refresh token signing |
| `SEED_SECRET` | Protects `POST /admin/seed` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | OAuth |
| `MICROSOFT_CLIENT_ID` / `MICROSOFT_CLIENT_SECRET` | OAuth |
| `SENDGRID_API_KEY` | Email notifications |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_PHONE_NUMBER` | SMS OTP |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `RAZORPAY_WEBHOOK_SECRET` | Payments |
| `ZOHO_CLIENT_ID` / `ZOHO_CLIENT_SECRET` | CRM sync |

GitHub Actions also requires `SEED_SECRET` for automated database seeding.

### Database Setup

```bash
pnpm db:setup              # Local D1 tables
pnpm db:seed               # Local seed via API
pnpm db:migrate:remote     # Production D1 migration
pnpm db:seed:remote        # Production seed (requires SEED_SECRET env)
```

### Development

```bash
# One-time: create local database tables
pnpm db:setup

# Start API + web + marketing (3 services)
pnpm dev

# Or start individually:
pnpm dev:api        # API on http://localhost:8787
pnpm dev:web        # Dashboard on http://localhost:3000
pnpm dev:marketing  # Marketing site on http://localhost:3001
```

On first API start in dev, demo users are **auto-seeded** if the database is empty.

If login fails with "Cannot reach API", ensure `pnpm dev:api` is running and you've run `pnpm db:setup` once.

**Production API:** `https://chasehorse-api.vineshjm.workers.dev`  
Set `NEXT_PUBLIC_API_URL` in `apps/web/.env.local` to point at your API URL.

### Demo Credentials

After seeding:

| Email | Role | Password |
|---|---|---|
| superadmin@chasehorse.com | Super Admin | Password123! |
| admin@democouriers.com | Company Admin | Password123! |
| manager@democouriers.com | Branch Manager | Password123! |
| driver@democouriers.com | Driver | Password123! |
| customer@example.com | Customer | Password123! |

## Modules (V1.0)

1. Authentication & RBAC (JWT, OAuth, MFA, OTP)
2. Company Management
3. Branch Management
4. Driver Management
5. Vehicle Management
6. Shipment Lifecycle
7. Real-Time Tracking (Durable Objects)
8. Pickup Scheduling
9. Proof of Delivery
10. Warehouse Management
11. Billing & Payments (Razorpay)
12. Customer Management
13. Notification Engine
14. Analytics & Reporting
15. CRM/ERP Integration Hub
16. API Marketplace
17. Webhook Engine
18. No-Code Workflow Builder
19. Support Center
20. Audit Logs

## API Endpoints

| Path | Description |
|---|---|
| `POST /api/auth/login` | Email login |
| `POST /api/auth/otp/request` | Request OTP |
| `GET /api/companies` | List companies |
| `GET /api/shipments` | List shipments |
| `GET /api/shipments/track/:awb` | Public tracking |
| `POST /api/billing/invoices` | Generate invoice |
| `GET /api/analytics/super-admin` | Platform analytics |
| `GET /api/v1/shipments` | REST API (API key auth) |
| `GET /openapi.json` | OpenAPI spec |
| `POST /webhooks/razorpay` | Razorpay payment webhook |
| `POST /api/uploads` | R2 file upload |

## Deployment

Deploy everything from the repo root:

```bash
pnpm deploy:production   # API + marketing + web app
```

Or individually:

```bash
pnpm deploy:api
pnpm deploy:marketing
pnpm deploy:web
```

### Cloudflare Pages

| App | Project name | Build output |
|---|---|---|
| Marketing | `chasehorse-marketing` | `apps/marketing/out` |
| Web app | `chasehorse-app` | `apps/web/out` |

> Do **not** run `npx wrangler deploy` from the repo root — use the `deploy:*` scripts above.

GitHub Actions deploys API, marketing, and web on push to `main` (requires `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and `SEED_SECRET` secrets).

See [docs/HANDOFF.md](docs/HANDOFF.md) for the full dev team handoff and production checklist.

## License

Proprietary — ChaseHorse V1.0
