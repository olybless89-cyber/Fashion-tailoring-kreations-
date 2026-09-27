# Fashion Tailoring Kreation (FTK) — online store

Made-to-measure menswear shop: Senator, Native two-piece, Agbada, English wear, Office wear, Adire, Jeans.

**Stack:** Next.js 16 · React 19 · Tailwind v4 · Drizzle ORM · PostgreSQL · Paystack

## Deploy on Railway
1. New project → Deploy from GitHub repo.
2. Add a **Postgres** service.
3. On the web service, set variables (see `.env.example`):
   - `DATABASE_URL=${{Postgres.DATABASE_URL}}`
   - `NEXT_PUBLIC_SITE_URL` (your Railway or custom domain)
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET` (`openssl rand -base64 48`)
   - WhatsApp, phone, email, bank details, delivery fees
4. Deploy. On start, migrations run and the catalogue seeds once (only if empty).

Build: `npm run build` · Start: `npm start`

## Paystack
- Set `PAYSTACK_SECRET_KEY` and `NEXT_PUBLIC_PAYSTACK_ENABLED=true`.
- Webhook URL in Paystack dashboard: `https://YOUR-DOMAIN/api/paystack/webhook`

## Admin
`/admin` — orders, status updates, mark transfers as paid, WhatsApp the customer, products (with photo upload), collections.
Uploaded photos are stored in Postgres, so they survive Railway redeploys.

## Changing the database
Edit `src/db/schema.ts` → `npm run db:generate` → commit the new file in `/drizzle`.

## Local
```
cp .env.example .env   # set DATABASE_URL
npm install
npm run db:migrate
npm run dev
```
