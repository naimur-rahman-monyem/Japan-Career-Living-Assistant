# Japan Career & Living Assistant

A pragmatic Next.js App Router starter for planning a move to Japan. It includes a polished public landing page, local credentials demo login, personalized dashboard, salary/cost calculators, readiness scoring, REST APIs, Prisma schema/seed, and accessible responsive styling.

## Quick start
1. Copy `.env.example` to `.env` and point `DATABASE_URL` at PostgreSQL.
2. `npm install`
3. `npm run db:generate`
4. `npm run db:migrate` (or `npm run db:push` for a disposable local database)
5. `npm run db:seed`
6. `npm run dev` (demo login: `demo@example.com` / `demo1234`)

`AUTH_SECRET` should be replaced in production. The demo auth uses an httpOnly signed cookie and is intentionally local; replace with Auth.js/your identity provider before production use.

## Product surfaces
Browse jobs, companies, locations, salary guidance, Japanese learning milestones and visa information. Authenticated users can save jobs and review a personal profile. REST endpoints are available under `/api/jobs`, `/api/companies`, `/api/locations`, `/api/saved-jobs` and `/api/calculators`.

## Validation

Run `npm run type-check`, `npm test`, and `npm run build` before deployment. See the documentation in `docs/`.
