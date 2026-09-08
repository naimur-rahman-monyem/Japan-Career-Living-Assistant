# Japan Career & Living Assistant

A pragmatic Next.js App Router starter for planning a move to Japan. It includes a polished public landing page, local credentials demo login, personalized dashboard, salary/cost calculators, readiness scoring, REST APIs, Prisma schema/seed, and accessible responsive styling.

## Quick start
1. Copy `.env.example` to `.env` and point `DATABASE_URL` at PostgreSQL.
2. `npm install`
3. `npm run db:generate`
4. `npm run db:migrate` (or `npm run db:push` for a disposable local database)
5. `npm run db:seed`
6. `npm run db:import-living-cost -- "C:\Users\Lenovo\Downloads\japan_living_cost_project_data.xlsx"`
7. `npm run dev` (demo login: `demo@example.com` / `demo1234`)

`AUTH_SECRET` should be replaced in production. The demo auth uses an httpOnly signed cookie and is intentionally local; replace with Auth.js/your identity provider before production use.

## Product surfaces
Browse jobs, companies, locations, salary guidance, Japanese learning milestones, visa information, and the database-backed [living-cost guide](/living-cost). Authenticated users can save jobs and review a personal profile. REST endpoints are available under `/api/jobs`, `/api/companies`, `/api/locations`, `/api/saved-jobs`, `/api/calculators`, and `/api/living-cost`.

## Living-cost data

The living-cost feature imports the provided Numbeo workbook into PostgreSQL. The importer reads the `Raw Data` sheet, validates `City`, `Category`, `Item`, `Price (JPY)`, and `Range`, cleans yen/currency formatting, and upserts records using city/category/item uniqueness. It is safe to run repeatedly:

`npm run db:import-living-cost -- "C:\path\to\japan_living_cost_project_data.xlsx"`

The application calculates planning estimates from raw records: outside-centre one-bedroom rent, an inexpensive restaurant meal multiplied by 30 for food, monthly public transport, utilities, broadband, mobile, and four cinema tickets for entertainment. Values are estimates based on the imported dataset and actual costs may vary. Hiroshima is not included because the provided source has no usable price table for it.

Seeded jobs and fictional employers are clearly demo data. No external job APIs are used.

## Validation

Run `npm run type-check`, `npm test`, and `npm run build` before deployment. See the documentation in `docs/`.
