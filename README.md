# IRL Quest

Initial pnpm/Turborepo monorepo foundation for the IRL Quest platform.

## Structure

- `apps/web` — React, Vite, React Router, Tailwind
- `apps/mobile` — Expo, Expo Router, NativeWind
- `apps/api` — Hono API with environment validation
- `packages/types` — shared TypeScript types
- `packages/validation` — shared Zod schemas
- `packages/api-client` — typed API client
- `packages/config` — shared configuration
- `packages/database` — Prisma client boundary
- `prisma` — database schema

## Getting started

```sh
pnpm install
pnpm dev
```

Copy `.env.example` to `.env` before running the API. No secrets are committed.
