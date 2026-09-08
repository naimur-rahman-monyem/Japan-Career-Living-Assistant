# Development

On Windows, copy `.env.example` to `.env`, set a PostgreSQL connection string and a long `AUTH_SECRET`, then run:

```powershell
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

The seed account is `demo@example.com` with password `demo1234`; use it only for local development.
