# ChaseHorse V1.0 — Dev Team Handoff

## Production URLs

| Service | URL |
|---------|-----|
| Marketing | https://chasehorse-marketing-8ic.pages.dev |
| Dashboard | https://chasehorse-app.pages.dev |
| API | https://chasehorse-api.vineshjm.workers.dev |

## Code layout (actual paths)

| Handoff doc path | Actual path |
|------------------|-------------|
| `apps/web/src/modules/**` | `apps/web/src/components/**` + `apps/web/src/app/**` |
| `packages/shared/src/constants/roles.ts` | `packages/shared/src/constants.ts` |
| `packages/core/src/shipment/stateMachine.ts` | `packages/core/src/pricing.ts` (`canTransitionShipment`) |
| `packages/core/src/pickup/slots.ts` | `packages/core/src/pickup/slots.ts` |
| `packages/shared/src/notifications/templates.ts` | `packages/shared/src/notifications/templates.ts` |
| OAuth routes | `workers/api-gateway/src/routes/auth.ts` |
| OpenAPI | `workers/api-gateway/src/openapi.ts` → `GET /openapi.json` |

## Demo credentials (after seed)

| Email | Role | Password |
|-------|------|----------|
| superadmin@chasehorse.com | Super Admin | Password123! |
| admin@democouriers.com | Company Admin | Password123! |
| manager@democouriers.com | Branch Manager | Password123! |
| driver@democouriers.com | Driver | Password123! |
| customer@example.com | Customer | Password123! |

## Production checklist

1. Set all Worker secrets (see README)
2. `pnpm db:migrate:remote`
3. `SEED_SECRET=... API_URL=... pnpm db:seed:remote`
4. `pnpm deploy:production`
5. Set `NEXT_PUBLIC_MAPS_API_KEY` in Cloudflare Pages env for dashboard

## Contact

Apollo Web Designs — vineshmon@thestackly.com
