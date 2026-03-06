# Setup Guide - Startup Launch Tracker

This guide will help you set up and run the Startup Launch Tracker project locally.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** 20+ and npm 10+
- **PostgreSQL** 16+
- **Redis** 7+ (optional for MVP, required for jobs)

## Installation Steps

### 1. Clone and Install Dependencies

```bash
cd startup-tracker

# Install root dependencies
npm install

# Install workspace dependencies
npm install --workspaces
```

### 2. Setup PostgreSQL Database

Create a new PostgreSQL database:

```bash
# Using psql
createdb startup_tracker

# Or using SQL
psql -U postgres
CREATE DATABASE startup_tracker;
\q
```

### 3. Configure Environment Variables

#### Backend API (.env)

```bash
cd apps/api
cp .env.example .env
```

Edit `apps/api/.env` with your configuration:

```env
# Server
NODE_ENV=development
PORT=3001
API_VERSION=v1

# Database (update with your credentials)
DATABASE_URL=postgresql://postgres:password@localhost:5432/startup_tracker

# Redis (if using)
REDIS_URL=redis://localhost:6379

# External APIs (optional for MVP)
# TWITTER_API_KEY=
# LINKEDIN_CLIENT_ID=
# CRUNCHBASE_API_KEY=
# APOLLO_API_KEY=
# HUNTER_API_KEY=
# ANTHROPIC_API_KEY=

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend Web (.env.local)

```bash
cd apps/web
cp .env.example .env.local
```

Edit `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### 4. Generate and Run Database Migrations

```bash
cd apps/api

# Generate migration files from schema
npm run db:generate

# Run migrations
npm run db:migrate
```

### 5. Start Development Servers

You can start both frontend and backend together or separately:

#### Option A: Start Everything (Recommended)

```bash
# From project root
npm run dev
```

This will start:
- Backend API on http://localhost:3001
- Frontend Web on http://localhost:3000

#### Option B: Start Separately

Terminal 1 - Backend:
```bash
cd apps/api
npm run dev
```

Terminal 2 - Frontend:
```bash
cd apps/web
npm run dev
```

## First Steps After Setup

### 1. Verify API is Running

Visit http://localhost:3001/api/v1/health

You should see:
```json
{
  "status": "ok",
  "timestamp": "2025-03-03T..."
}
```

### 2. Sync YCombinator Companies

Open the dashboard at http://localhost:3000/dashboard and click the "Sync YC Companies" button. This will populate your database with YCombinator companies.

Alternatively, use the API directly:
```bash
curl -X POST http://localhost:3001/api/v1/sync/yc
```

### 3. Create a Test Launch (Optional)

```bash
curl -X POST http://localhost:3001/api/v1/launches \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": "YOUR_COMPANY_ID",
    "platform": "twitter",
    "postUrl": "https://x.com/example/status/123",
    "likesCount": 100,
    "commentsCount": 10,
    "sharesCount": 5,
    "viewsCount": 1000
  }'
```

## Project Structure

```
startup-tracker/
├── apps/
│   ├── api/              # Backend API (Node.js + Express)
│   │   ├── src/
│   │   │   ├── domain/          # Business entities and rules
│   │   │   ├── application/     # Use cases
│   │   │   ├── infrastructure/  # External services, DB
│   │   │   └── presentation/    # Controllers, routes
│   │   └── package.json
│   └── web/              # Frontend (Next.js)
│       ├── app/                 # App Router pages
│       ├── components/          # React components
│       ├── lib/                 # Utilities
│       └── package.json
└── package.json          # Root workspace config
```

## Available API Endpoints

### Companies
- `GET /api/v1/companies` - List all companies
- `GET /api/v1/companies/:id` - Get company by ID
- `POST /api/v1/companies` - Create company

### Launches
- `GET /api/v1/launches` - List all launches
- `POST /api/v1/launches` - Create launch

Query parameters:
- `?limit=N` - Limit results (default: 50)
- `?offset=N` - Offset for pagination
- `?performanceTier=low|medium|high` - Filter by performance
- `?companyId=UUID` - Filter by company

### Sync
- `POST /api/v1/sync/yc` - Sync YCombinator companies
- `POST /api/v1/sync/yc?batch=W25` - Sync specific batch

## Development Tips

### Database Management

View database in Drizzle Studio:
```bash
cd apps/api
npm run db:studio
```

### Type Checking

```bash
# Check all workspaces
npm run type-check

# Check specific workspace
npm run type-check --workspace=apps/api
```

### Linting

```bash
npm run lint
```

### Building for Production

```bash
# Build all workspaces
npm run build

# Build specific workspace
npm run build --workspace=apps/web
```

## Troubleshooting

### Database Connection Issues

If you see "database connection failed":

1. Ensure PostgreSQL is running:
```bash
# macOS with Homebrew
brew services list
brew services start postgresql@16

# Linux
sudo systemctl status postgresql
sudo systemctl start postgresql
```

2. Verify connection string in `.env`
3. Check database exists:
```bash
psql -U postgres -l
```

### Port Already in Use

If port 3000 or 3001 is already in use:

1. Find and kill the process:
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill
lsof -ti:3001 | xargs kill
```

2. Or change the port in `.env` files

### Migration Errors

If migrations fail:

1. Drop and recreate database:
```bash
dropdb startup_tracker
createdb startup_tracker
npm run db:migrate --workspace=apps/api
```

2. Check migration files in `apps/api/src/infrastructure/database/migrations/`

## Next Steps

1. **Add External APIs**: Configure Twitter, LinkedIn, Crunchbase API keys in `.env`
2. **Setup Redis**: Install and configure Redis for job queues
3. **Implement Scrapers**: Add automated scraping jobs with BullMQ
4. **Contact Enrichment**: Integrate Apollo.io and Hunter.io
5. **DM Generation**: Add Anthropic Claude API for DM automation

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review error logs in the terminal
3. Check the API health endpoint
4. Verify all environment variables are set correctly

## Architecture

This project follows **Clean Architecture** principles:

- **Domain Layer**: Pure business logic, no dependencies
- **Application Layer**: Use cases, orchestration
- **Infrastructure Layer**: External services, database, APIs
- **Presentation Layer**: HTTP routes, controllers

This separation ensures:
- Testability
- Maintainability
- Flexibility to swap implementations
- Clear separation of concerns
