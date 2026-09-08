# Architecture

The app uses Next.js App Router. Pages and route handlers access PostgreSQL through Prisma in `src/lib/db.ts`. Recommendation and readiness calculations are isolated in `src/lib` so they can be tested independently.

The local demo uses a signed HTTP-only cookie session. Replace this adapter with Auth.js or an identity provider before production deployment.
