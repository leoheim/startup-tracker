# Startup Launch Tracker

A comprehensive dashboard for tracking startup launches from social media platforms and managing fundraising data. Built with Clean Architecture principles, TypeScript, and modern web technologies.

## Live Demo

- Application: https://startup-tracker-web.vercel.app/
- API: https://startup-tracker-api.onrender.com/api/v1/health

## Features

### Core Functionality

- **Dashboard** - Real-time statistics and overview of all tracked companies and launches
- **Company Management** - Browse and search YCombinator companies with detailed information
- **Launch Tracking** - Monitor startup launches with engagement metrics
- **Analytics** - Visualize performance distribution, platform usage, and industry trends
- **Contact Enrichment** - Email, phone, LinkedIn, and X (Twitter) contact information for companies
- **AI-Generated DM Drafts** - Automated outreach messages for poorly performing launches

### Metrics & Analytics

- Likes, comments, shares, and views tracking
- Automated engagement score calculation
- Performance tier classification (Low/Medium/High)
- Platform-specific analytics (X/Twitter, LinkedIn)
- Industry distribution charts

### YCombinator Integration

- Sync companies from YCombinator's public API
- Automatically imports company metadata
- Filters for recent batches (last 3 batches)
- 550+ companies available for tracking

## Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### Backend

- **Node.js 20+** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - End-to-end type safety
- **Clean Architecture** - Maintainable, testable structure

### Database & ORM

- **PostgreSQL 16+** - Relational database
- **Drizzle ORM** - Type-safe database queries
- 5 database tables with relationships

### Code Quality

- **Zod** - Runtime type validation
- **Pino** - Structured logging
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## Project Structure

```
startup-tracker/
├── apps/
│   ├── web/                      # Next.js Frontend
│   │   ├── app/
│   │   │   ├── page.tsx          # Home page
│   │   │   ├── dashboard/        # Dashboard with stats
│   │   │   ├── launches/         # Launches list & new form
│   │   │   ├── companies/        # Companies list & search
│   │   │   └── analytics/        # Charts & visualizations
│   │   └── lib/
│   │       └── api-client.ts     # Type-safe API client
│   │
│   └── api/                      # Node.js Backend (Clean Architecture)
│       └── src/
│           ├── domain/           # Business logic & entities
│           ├── application/      # Use cases
│           ├── infrastructure/   # External dependencies
│           └── presentation/     # HTTP layer
│
├── SETUP.md                      # Detailed setup guide
├── ARCHITECTURE.md               # Technical architecture docs
└── package.json                  # Monorepo configuration
```

## Quick Start

### Prerequisites

- Node.js 20+ (use [nvm](https://github.com/nvm-sh/nvm) to manage versions)
- PostgreSQL 16+ ([Postgres.app](https://postgresapp.com/) recommended for macOS)
- npm 10+ (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   cd startup-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create the database**
   ```bash
   createdb startup_tracker
   ```

4. **Run the SQL migration**
   ```bash
   /Applications/Postgres.app/Contents/Versions/latest/bin/psql -d startup_tracker -f apps/api/create-tables.sql
   ```

5. **Set up environment variables**
   ```bash
   # Backend
   cd apps/api
   cp .env.example .env
   # Edit .env and set DATABASE_URL
   # Example: postgresql://localhost:5432/startup_tracker

   # Frontend
   cd ../web
   cp .env.example .env.local
   # NEXT_PUBLIC_API_URL is already set to http://localhost:3001
   ```

6. **Start the development servers**
   ```bash
   # From the root directory
   cd ../..
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:3001/api/v1
   - Health Check: http://localhost:3001/api/v1/health

## Usage Guide

### 1. Load Dashboard Data

1. Navigate to the Dashboard (http://localhost:3000/dashboard)
2. Click the "Load Dashboard Data" button
3. Wait for confirmation (syncs 550+ companies and generates sample launches)

### 2. Browse Companies

1. Go to Companies page (http://localhost:3000/companies)
2. Use the search bar to filter by name, industry, or YC batch
3. View company statistics and funding information
4. Click "View Contacts" to see enriched contact information

### 3. View Launches

1. Navigate to Launches page (http://localhost:3000/launches)
2. View all startup launches with engagement metrics
3. Filter by performance tier (All/Low/Medium/High)
4. Click on launches to view detailed metrics

### 4. Add a Launch

1. Navigate to Launches → "Add New Launch" (http://localhost:3000/launches/new)
2. Select a company from the dropdown
3. Choose platform (X/Twitter or LinkedIn)
4. Enter post URL
5. Add engagement metrics (likes, comments, shares, views)
6. Click "Create Launch"

The system will automatically:
- Calculate the engagement score
- Assign a performance tier (Low/Medium/High)
- Store the launch in the database

### 5. View Analytics

1. Go to Analytics page (http://localhost:3000/analytics)
2. View performance distribution pie chart
3. See platform usage bar chart
4. Explore top 10 industries
5. Monitor key metrics: total launches, avg likes, total comments/shares

## Architecture Highlights

### Clean Architecture Layers

```
┌─────────────────────────────────────┐
│         Presentation Layer          │  ← Controllers, Routes, Middleware
├─────────────────────────────────────┤
│        Application Layer            │  ← Use Cases, Business Logic
├─────────────────────────────────────┤
│          Domain Layer               │  ← Entities, Interfaces, Services
├─────────────────────────────────────┤
│       Infrastructure Layer          │  ← Database, External APIs, Cache
└─────────────────────────────────────┘
```

### Engagement Score Algorithm

The system calculates engagement scores using weighted metrics:

```typescript
score = (likes × 1) + (comments × 3) + (shares × 5) + (views × 0.01)

Performance Tiers:
- High: score >= 1000
- Medium: 100 <= score < 1000
- Low: score < 100
```

### Database Schema

- **companies** - Startup information (550 from YC)
- **launches** - Social media launch posts with metrics
- **funding_rounds** - Fundraising data
- **contacts** - Enriched contact information
- **dm_campaigns** - DM automation tracking

## API Endpoints

### Companies

- `GET /api/v1/companies` - List all companies (with pagination)
- `GET /api/v1/companies/:id` - Get company by ID
- `POST /api/v1/companies` - Create new company

### Launches

- `GET /api/v1/launches` - List all launches (with filters)
- `GET /api/v1/launches/:id` - Get launch by ID
- `POST /api/v1/launches` - Create new launch

### Sync

- `POST /api/v1/sync/yc` - Sync YCombinator companies

### Seed

- `POST /api/v1/seed/sample-data` - Generate sample launch data

### Health

- `GET /api/v1/health` - Health check endpoint

## Security Features

- Input validation with Zod schemas
- SQL injection prevention (Drizzle ORM)
- Security headers (Helmet.js)
- CORS configuration
- Environment variable validation
- Error message sanitization
- Type-safe database queries

## Development Commands

```bash
# Install dependencies
npm install

# Start all dev servers (frontend + backend)
npm run dev

# Start frontend only
npm run dev:web

# Start backend only
npm run dev:api

# Build all apps
npm run build

# Type check
npm run type-check --workspace=apps/api
npm run type-check --workspace=apps/web

# Lint
npm run lint --workspace=apps/api
npm run lint --workspace=apps/web
```

## Troubleshooting

### Database Connection Error

```bash
# Verify PostgreSQL is running
# Check your DATABASE_URL in apps/api/.env
```

### Port Already in Use

```bash
# Frontend (3000) or Backend (3001) port conflicts
# Kill the process:
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Node Version Error

```bash
# Use Node 20+ (LTS recommended)
nvm use 20.19.6
nvm alias default 20.19.6
```

## License

MIT License - feel free to use this project for learning and development.

## Technical Implementation

This project demonstrates:

- Clean Architecture implementation
- TypeScript best practices
- Type-safe full-stack development
- Modern React patterns (Server Components, App Router)
- Database design and ORM usage
- API design and RESTful principles
- Security best practices
- Professional documentation

Built with attention to detail and following software engineering best practices.
