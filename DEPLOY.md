# Deploying LAMCS to Cloudflare Pages (D1)

This guide covers building the LAMCS platform for **Cloudflare Pages** with a **D1** (SQLite-compatible, edge-persistent) database — replacing the local SQLite file.

> The Cloudflare build output is the `.vercel/output` folder produced by `@cloudflare/next-on-pages`. That folder is what you "drop" into Cloudflare (via Git integration or direct upload).

---

## 1. Prerequisites
- Node.js 18+ and npm.
- A Cloudflare account (free tier works for Pages + D1).
- `wrangler` (installed as a dev dependency; run via `npx wrangler` or the npm scripts).

---

## 2. Install dependencies
```bash
npm install
```
This installs `@cloudflare/next-on-pages`, `wrangler`, `@prisma/adapter-d1`, and `bcryptjs` (pure-JS, required because the native `bcrypt` addon does **not** run on Cloudflare's Workerd runtime).

---

## 3. Create the D1 database
```bash
npx wrangler d1 create lamcs-db
```
Copy the **database_id** from the output and paste it into `wrangler.toml` where it says `REPLACE_WITH_YOUR_D1_ID`.

---

## 4. Initialize the D1 schema
Generate the SQL from the Prisma schema and apply it (locally first, then remotely):
```bash
# Local (for `npm run cf:dev`)
npm run db:d1:init:local

# Remote (your live D1 instance)
npm run db:d1:init:remote
```

---

## 5. (Optional) Seed D1
The seed script writes to a standard Prisma client, so for D1 you export the data as SQL:
```bash
# Export seed data to prisma/seed.sql, then:
npm run db:d1:seed
```
Default credentials after seeding:
- Admin: `admin@lamcs.coop` / `admin123`
- Member: `+260970000001` / `member123`

---

## 6. Build for Cloudflare
```bash
npm run cf:build
```
This runs `next build` then transforms the output into `.vercel/output` (the Cloudflare Pages build output). The D1 binding `DB` is read at runtime from `wrangler.toml`.

> If you hit a Prisma client error during build, run `npm run db:generate` first.

---

## 7. Test locally (optional)
```bash
npm run cf:dev
```
This serves the built output on a local Pages-like runtime with a local D1 bound to `prisma/dev.db`.

---

## 8. Deploy
```bash
npm run cf:deploy
```
Or connect the Git repository to Cloudflare Pages and set the **build command** to `npm run cf:build` and the **output directory** to `.vercel/output` (already set via `pages_build_output_dir` in `wrangler.toml`).

### Environment variables to set in Cloudflare Pages:
- `DATABASE_URL` — any placeholder (e.g. `file:./lamcs_dev.db`); the real DB is the D1 binding `DB`.
- `NEXTAUTH_SECRET` — a random string (`openssl rand -base64 32`).
- `NEXTAUTH_URL` — your production URL (e.g. `https://lamcs-platform.pages.dev`).
- `MTN_MOMO_SUBSCRIPTION_KEY`, `MTN_MOMO_API_USER`, `MTN_MOMO_API_KEY`, `MTN_MOMO_ENV` — only if enabling live MoMo (sandbox works without them; the code degrades gracefully).

---

## 9. Important notes / caveats
- **`bcrypt` → `bcryptjs`**: the native `bcrypt` package was replaced because Workerd cannot load native Node addons. Hashing behaviour is equivalent.
- **D1 adapter**: `src/lib/prisma.ts` uses the Prisma D1 driver adapter when `NODE_ENV === "production"` and falls back to the local SQLite `DATABASE_URL` everywhere else, so `npm run dev` still works unchanged.
- **D1 is eventually consistent and single-region**; for very high concurrent load (SRS §4.1) a hosted Postgres may be preferable later.
- **Sessions**: NextAuth uses JWT (`maxAge: 8h`), so no session DB is required — compatible with the edge runtime.
- **Images**: remote Unsplash images work via `next/image` only if Cloudflare image optimization is enabled, or swap to plain `<img>` / a Cloudflare Images setup.
