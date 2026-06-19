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

**Marketing website (Tesla-style):** http://localhost:3001  
**SaaS dashboards:** http://localhost:3000

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

Copy `.env.example` to `apps/web/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8787
```

For the API worker, create `workers/api-gateway/.dev.vars`:

```
JWT_SECRET=your-jwt-secret-min-32-chars-long!!
JWT_REFRESH_SECRET=your-refresh-secret-min-32!!
FRONTEND_URL=http://localhost:3000
```

### Database Setup

```bash
cd workers/api-gateway
pnpm wrangler d1 execute chasehorse-db --local --file=../../packages/database/drizzle/0000_init.sql
pnpm wrangler dev
# In another terminal, seed the database:
curl -X POST http://localhost:8787/admin/seed
```

### Development

```bash
# Terminal 1 — API
pnpm --filter @chasehorse/api-gateway dev

# Terminal 2 — Web
pnpm --filter @chasehorse/web dev
```

- Web: http://localhost:3000
- API: http://localhost:8787

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
| `POST /graphql` | GraphQL (enterprise) |

## Deployment

### Cloudflare Pages (marketing site)

In your Cloudflare **Workers & Pages** build settings:

| Setting | Value |
|---|---|
| **Build command** | `pnpm install --frozen-lockfile && pnpm build:marketing` |
| **Deploy command** | `npx wrangler pages deploy apps/marketing/out --project-name=chasehorse-marketing` |

> Do **not** run `npx wrangler deploy` from the repo root — this monorepo has multiple apps and Wrangler needs a project-specific config.

### API worker

```bash
pnpm deploy:api
# or: npx wrangler deploy --config workers/api-gateway/wrangler.toml
```

### SaaS web app (separate Pages project)

The dashboard app (`apps/web`) is not static-exported yet; deploy it as a separate Cloudflare Pages project when ready.

GitHub Actions workflows handle CI and production deployment on push to `main`.

## License

Proprietary — ChaseHorse V1.0
