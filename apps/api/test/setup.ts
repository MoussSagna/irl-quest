process.env.BETTER_AUTH_URL ??= 'http://localhost:8787';

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error(
    'Authentication tests require BETTER_AUTH_SECRET in the environment.',
  );
}

if (!process.env.DATABASE_URL) {
  console.info(
    'Authentication integration tests skipped: set DATABASE_URL to a reachable PostgreSQL database.',
  );
}
