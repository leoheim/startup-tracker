# Quick Start Guide

Get the Startup Launch Tracker running in 5 minutes!

## Prerequisites

- Node.js 20+ installed
- PostgreSQL 16+ installed and running

## Step-by-Step

### 1. Install Dependencies (1 min)

```bash
cd startup-tracker
npm install
```

### 2. Create Database (30 seconds)

```bash
createdb startup_tracker
```

Or using psql:
```bash
psql -U postgres -c "CREATE DATABASE startup_tracker;"
```

### 3. Configure Environment Variables (1 min)

Backend:
```bash
cd apps/api
cp .env.example .env
```

Edit `apps/api/.env` and update the `DATABASE_URL`:
```env
DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/startup_tracker
```

Frontend:
```bash
cd ../web
cp .env.example .env.local
```

### 4. Run Database Migrations (30 seconds)

```bash
cd ../api
npm run db:generate
npm run db:migrate
```

### 5. Start the Application (30 seconds)

From the project root:
```bash
cd ../..
npm run dev
```

You should see:
```
🚀 Server is running!
📡 Port: 3001
🌍 Environment: development

ready - started server on 0.0.0.0:3000
```

### 6. Open the Dashboard (10 seconds)

Visit: **http://localhost:3000/dashboard**

### 7. Load Sample Data (1 min)

Click the **"Sync YC Companies"** button in the dashboard.

This will fetch real YCombinator companies and populate your database!

---

## Verify Everything is Working

### Check API Health

```bash
curl http://localhost:3001/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-03-03T..."
}
```

### Check Companies

```bash
curl http://localhost:3001/api/v1/companies
```

Should return a list of YC companies after sync.

---

## What You Can Do Now

1. **View Companies**: Browse synced YC companies
2. **Add Launches**: Manually create launch entries
3. **Check Engagement**: See calculated performance tiers
4. **Explore Code**: Understand the Clean Architecture

---

## Next Steps

1. Read `SETUP.md` for detailed configuration
2. Read `ARCHITECTURE.md` to understand the codebase
3. Read `IMPLEMENTATION_SUMMARY.md` for what's next
4. Start implementing Phase 2 features!

---

## Common Issues

**Port 3000 already in use?**
```bash
lsof -ti:3000 | xargs kill
```

**Port 3001 already in use?**
```bash
lsof -ti:3001 | xargs kill
```

**Database connection failed?**
- Check PostgreSQL is running: `pg_ctl status`
- Verify DATABASE_URL in `.env`
- Ensure database exists: `psql -l`

**Dependencies not installing?**
- Check Node.js version: `node -v` (should be 20+)
- Clear cache: `npm cache clean --force`
- Try: `rm -rf node_modules package-lock.json && npm install`

---

## Development Tips

### View Database in Drizzle Studio

```bash
cd apps/api
npm run db:studio
```

Opens a visual database browser!

### Test API Endpoints

Create a launch:
```bash
curl -X POST http://localhost:3001/api/v1/launches \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": "YOUR_COMPANY_ID",
    "platform": "twitter",
    "postUrl": "https://x.com/example/status/123",
    "likesCount": 150,
    "commentsCount": 20,
    "sharesCount": 10,
    "viewsCount": 2000
  }'
```

### Hot Reload

Both frontend and backend have hot reload:
- Edit backend files → Server auto-restarts
- Edit frontend files → Page auto-refreshes

---

**🎉 You're all set! Happy coding!**
