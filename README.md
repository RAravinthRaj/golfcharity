<<<<<<< HEAD
# golfcharity
=======
# Golf Charity Subscription Platform

MERN project built from the PRD in `PRD Full Stack Training.pdf`, with three separate deployable apps:

- `server` - Express + MongoDB API
- `user` - public site and subscriber dashboard
- `admin` - admin panel

## Implemented modules

- JWT authentication for user and admin roles
- Monthly and yearly subscription state handling
- Charity directory with featured items and profiles
- Rolling Stableford score logic that keeps only the latest 5 scores
- Draw simulation engine with random and algorithmic modes
- Prize pool split for 3-match, 4-match, and 5-match winners
- Winner proof upload and admin payout status updates
- Separate user and admin frontends

## Folder structure

```text
Golf/
  admin/
  server/
  user/
  docker-compose.yml
```

## Quick start

1. Start MongoDB:

```bash
cd /Users/aravinthraj/Developer/Golf
docker compose up -d
```

If you already have MongoDB locally, you can skip Docker.

2. Copy environment templates:

```bash
cp server/.env.example server/.env
cp user/.env.example user/.env
cp admin/.env.example admin/.env
```

3. Install dependencies:

```bash
npm install
```

4. Seed demo data:

```bash
npm run seed
```

5. Run each app in a separate terminal:

```bash
npm run dev:server
npm run dev:user
npm run dev:admin
```

## Local URLs

- User website: `http://localhost:5173`
- User dashboard: `http://localhost:5173/dashboard`
- Admin panel: `http://localhost:5174`
- API: `http://localhost:8000/api`

## Demo credentials

- Admin email: `admin@golfcharity.com`
- Admin password: `Admin@123`
- User email: `ava@golfcharity.com`
- User password: `User@123`

## Notes for submission

- Stripe checkout session route is included, but local demo activation is enabled for fast evaluation without Stripe keys.
- Winner proof uploads are stored under `server/uploads`.
- The server expects a MongoDB connection before seeding or starting.
- The frontends already build successfully for deployment.

## Deployment outline

- Deploy `server` to Render, Railway, or any Node host with MongoDB connection string
- Deploy `user` to Vercel as the public site
- Deploy `admin` to Vercel as the admin site
- Update `CLIENT_URL`, `ADMIN_URL`, and `VITE_API_URL` to your deployed domains
>>>>>>> 401cf79 (Initial Golf charity platform)
