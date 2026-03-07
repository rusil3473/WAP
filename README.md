# WAP

Single Next.js project for both customer and owner flows.

## Hierarchy

- `src/` application code
- `src/app/(routes)/(auth|customer|owner|shared|legacy-redirects)` grouped frontend routes
- `src/server/services` reusable backend business/data functions
- `public/` static assets
- `db/schema.sql` PostgreSQL schema (works with Neon)
- `.env` environment variables

## Routes

- Customer routes: `/customer/*`
- Owner routes: `/owner/*`
- Customer account routes: `/customer/profile`, `/customer/payments`
- Shared authenticated routes: `/support`, `/profile`
- Owner earnings route: `/earnings`
- Onboarding routes: `/login`, `/set-password`, `/choose-role`
- Legacy routes still work via redirects.

## API Structure

- `api/auth/*` authentication + onboarding APIs
- `api/customer/*` customer-specific APIs
- `api/customer/profile` profile read/update API
- `api/customer/payments` payment summary API
- `api/customer/payments/pay` mark booking payment as paid
- `api/owner/earnings` owner earnings summary + transactions
- `api/auth/profile` authenticated profile update API
- `api/owner/*` owner-specific APIs

## Commands

- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm run start`
- `npm run db:init`

## Neon Setup

1. Create a Neon project and copy your connection string.
2. Run `npm run db:init` to create missing tables/relations automatically.
3. Optional: run `db/schema.sql` manually in Neon SQL editor.
4. Set these env vars in `.env`:
   - `DATABASE_URL` (use `sslmode=verify-full` for strong TLS verification)
   - `PROFILE_TABLE` (optional, defaults to `profiles`)
   - `WAREHOUSE_TABLE` (optional, defaults to `warehouses`)
   - `BOOKING_TABLE` (optional, defaults to `bookings`)

## Auth Notes

- Login and signup are merged on `/login`.
- If an email does not exist, account is auto-created with `role = NULL`.
- Users with `role = NULL` must select role once in `/choose-role`.
- Google-first users without password are redirected to `/set-password`.
- Email/password auth is stored in `profiles.password_hash`.
- Google login still works through NextAuth and creates profiles automatically.
- Password reset and email verification continue to use tokenized email links.
