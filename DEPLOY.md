# Deploying LAMCS to Render

This guide covers deploying the LAMCS platform on **Render** as a Node.js web service with a PostgreSQL database.

---

## 1. Prerequisites
- A Render account (free tier works).
- A GitHub account with the repository pushed.

---

## 2. Environment Variables

Set these in Render Dashboard → Environment:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Render PostgreSQL connection string (see §3) |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` output |
| `NEXTAUTH_URL` | `https://your-app.onrender.com` |
| `MTN_MOMO_SUBSCRIPTION_KEY` | MTN MoMo subscription key (optional for sandbox) |
| `MTN_MOMO_API_USER` | MTN MoMo API user |
| `MTN_MOMO_API_KEY` | MTN MoMo API key |
| `MTN_MOMO_ENV` | `sandbox` or `production` |

---

## 3. Database (Render PostgreSQL)

1. In Render Dashboard, create a new **PostgreSQL** database.
2. Copy the **Internal Database URL** into `DATABASE_URL`.
3. After first deploy, SSH into Render shell and run:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
   Or set `DATABASE_URL` locally and run:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

---

## 4. Deploy

1. In Render Dashboard → **New Web Service**.
2. Connect your GitHub repo (`mwemmz/lamcs-platform`).
3. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add all environment variables from §2.
5. Click **Create Web Service**.

Render will build and deploy automatically.

---

## 5. Default Credentials (after seeding)

- Admin: `admin@lamcs.coop` / `admin123`
- Member: `+260970000001` / `member123`

---

## 6. Local Development

```bash
npm install
cp .env.example .env  # edit DATABASE_URL for SQLite or local Postgres
npx prisma db push
npx prisma db seed
npm run dev
```
