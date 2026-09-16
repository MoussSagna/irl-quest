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

Copy `.env.example` to `.env` before running the API. The `.env` file is
ignored by Git and must never be committed.

## Cloud PostgreSQL with Neon

IRL Quest uses PostgreSQL through Prisma. A local PostgreSQL installation is
not required; [Neon](https://neon.tech) is the recommended provider.

1. Create a Neon project and database.
2. In the Neon dashboard, open the connection details and copy the pooled or
   direct PostgreSQL connection string.
3. Create a local `.env` file from the template:

   ```sh
   cp .env.example .env
   ```

4. Set `DATABASE_URL` in `.env` to the Neon connection string. It must include
   TLS, for example:

   ```env
   DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
   ```

   Do not commit this value or share it in chat. Keep `BETTER_AUTH_SECRET` in
   the local environment as well; use a different random value in production.

5. Generate the Prisma client and apply the existing migrations:

   ```sh
   pnpm --filter @irl-quest/database exec prisma generate \
     --schema ../../prisma/schema.prisma
   pnpm --filter @irl-quest/database exec prisma migrate deploy \
     --schema ../../prisma/schema.prisma
   ```

The migration creates the Better Auth `User`, `Session`, `Account`, and
`Verification` tables. Better Auth persists sessions and accounts through the
Prisma adapter using the same `DATABASE_URL`.

## Authentication

The API exposes Better Auth email/password endpoints under `/api/auth/*`.
Use `POST /api/auth/sign-up/email` and `POST /api/auth/sign-in/email`; the
session cookie is then accepted by the protected `GET /api/me` example route.
Set `DATABASE_URL`, `BETTER_AUTH_SECRET` (at least 32 random characters), and
`BETTER_AUTH_URL`, then start the API with `pnpm --filter @irl-quest/api dev`.

## Authentication tests

The authentication tests are integration tests and require a reachable
PostgreSQL database configured through `DATABASE_URL`. Without that variable,
the integration suite is explicitly skipped so unit/type/build checks can run
without a database. If `DATABASE_URL` is set but Neon is unreachable, the
tests fail with the database connection error rather than hiding it.

Run them with:

```sh
pnpm --filter @irl-quest/api test
```
