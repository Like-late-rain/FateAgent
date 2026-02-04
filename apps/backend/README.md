# Backend Service

## Tech stack
- Node.js 20
- TypeScript
- Express
- Supabase SDK

## Environment variables
- PORT (default: 3001)
- FRONTEND_URL (default: http://localhost:3000)
- JWT_SECRET (required)
- JWT_EXPIRES_IN (default: 7d)
- SUPABASE_URL (required)
- SUPABASE_SERVICE_KEY (required)
- AGENT_SERVICE_URL (optional; when unset, uses mock results)
- AGENT_API_KEY (optional; must match agent service)
- WECHAT_API_KEY (required for payment callback auth)
- NODE_ENV (optional; production enables secure cookies)

## Local development
From the repo root:
- Install deps: `pnpm install`
- Start dev server: `pnpm --filter @fateagent/backend dev`
- Build: `pnpm --filter @fateagent/backend build`
- Run compiled server: `pnpm --filter @fateagent/backend start`

## Docker
Build from the repo root:

```bash
docker build -f apps/backend/Dockerfile -t fateagent-backend .
```

Run:

```bash
docker run --rm -p 3001:3001 \
  -e JWT_SECRET=your-secret \
  -e SUPABASE_URL=your-supabase-url \
  -e SUPABASE_SERVICE_KEY=your-supabase-key \
  fateagent-backend
```
