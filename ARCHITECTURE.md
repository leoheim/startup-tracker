# Architecture Documentation

## Overview

Startup Launch Tracker follows Clean Architecture principles with a monorepo structure using npm workspaces.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client                              │
│                   (Browser/Next.js)                         │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                      │
│                (Routes, Controllers, DTOs)                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│                  (Use Cases, Business Logic)                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                       Domain Layer                          │
│              (Entities, Interfaces, Services)               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                      │
│        (Database, External APIs, Cache, Queues)            │
└─────────────────────────────────────────────────────────────┘
```

## Clean Architecture Layers

### 1. Domain Layer (`src/domain/`)

**Purpose**: Core business logic, completely independent of external frameworks.

**Components**:
- **Entities**: Business objects (Company, Launch, FundingRound, Contact)
- **Interfaces**: Repository contracts
- **Services**: Domain services (e.g., EngagementCalculator)

**Rules**:
- No dependencies on other layers
- Pure TypeScript/JavaScript
- Framework-agnostic

**Example**:
```typescript
// Domain Entity
export interface Company {
  id: string;
  name: string;
  website?: string;
  // ... other fields
}

// Domain Service
export class EngagementCalculator {
  static calculateScore(launch: Launch): number {
    // Pure business logic
  }
}
```

### 2. Application Layer (`src/application/`)

**Purpose**: Orchestrate business logic through use cases.

**Components**:
- **Use Cases**: Application-specific business rules
- **DTOs**: Data Transfer Objects

**Rules**:
- Depends on Domain layer only
- Implements application-specific logic
- Technology-agnostic

**Example**:
```typescript
export class CreateLaunchUseCase {
  constructor(
    private launchRepository: ILaunchRepository,
    private companyRepository: ICompanyRepository
  ) {}

  async execute(input: CreateLaunchInput): Promise<Launch> {
    // Validate company exists
    // Check duplicate
    // Create launch
  }
}
```

### 3. Infrastructure Layer (`src/infrastructure/`)

**Purpose**: Implement external concerns (database, APIs, etc.).

**Components**:
- **Database**: Drizzle ORM, repositories, migrations
- **External APIs**: Twitter, LinkedIn, Crunchbase clients
- **Cache**: Redis integration
- **Queue**: BullMQ job processors

**Rules**:
- Implements interfaces from Domain layer
- Contains all external dependencies
- Can depend on Domain and Application layers

**Example**:
```typescript
export class CompanyRepository implements ICompanyRepository {
  async findById(id: string): Promise<Company | null> {
    // Drizzle ORM query
    return await db.select()...
  }
}

export class YCClient {
  async fetchAllCompanies(): Promise<YCCompany[]> {
    // External API call
  }
}
```

### 4. Presentation Layer (`src/presentation/`)

**Purpose**: Handle HTTP requests and responses.

**Components**:
- **Controllers**: Handle HTTP logic
- **Routes**: Define API endpoints
- **Middlewares**: Request/response processing

**Rules**:
- Depends on Application layer (use cases)
- Handles HTTP-specific concerns
- Validates input, formats output

**Example**:
```typescript
export class LaunchController {
  constructor(private getLaunchesUseCase: GetLaunchesUseCase) {}

  async getAll(req: Request, res: Response) {
    const launches = await this.getLaunchesUseCase.execute();
    res.json({ success: true, data: launches });
  }
}
```

## Data Flow

### Read Operation (GET /launches)

```
1. HTTP Request
   ↓
2. Route Handler (routes/index.ts)
   ↓
3. Controller (LaunchController)
   ↓
4. Use Case (GetLaunchesUseCase)
   ↓
5. Repository (LaunchRepository)
   ↓
6. Database (Drizzle ORM → PostgreSQL)
   ↓
7. Return data up the chain
   ↓
8. HTTP Response (JSON)
```

### Write Operation (POST /launches)

```
1. HTTP Request with data
   ↓
2. Validation (Zod schema)
   ↓
3. Controller (LaunchController)
   ↓
4. Use Case (CreateLaunchUseCase)
   ├─→ Validate company exists (CompanyRepository)
   ├─→ Check duplicate (LaunchRepository)
   └─→ Calculate engagement (EngagementCalculator)
   ↓
5. Repository.create() (LaunchRepository)
   ↓
6. Database INSERT
   ↓
7. Return created entity
   ↓
8. HTTP Response (201 Created)
```

## Database Schema

### Entity Relationship Diagram

```
┌──────────────┐
│  companies   │
│──────────────│
│ id (PK)      │─┐
│ name         │ │
│ website      │ │
│ industry     │ │
│ yc_batch     │ │
└──────────────┘ │
                 │
         ┌───────┴────────┬──────────────┐
         ↓                ↓              ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│funding_rounds│  │  launches    │  │  contacts    │
│──────────────│  │──────────────│  │──────────────│
│ id (PK)      │  │ id (PK)      │─┐│ id (PK)      │
│ company_id FK│  │ company_id FK││ │ company_id FK│
│ round_type   │  │ platform     │││ │ launch_id FK │
│ amount_raised│  │ post_url     │││ │ full_name    │
│ investors    │  │ likes_count  │││ │ email        │
└──────────────┘  │ engagement   │││ │ phone        │
                  └──────────────┘││ └──────────────┘
                                  ││
                          ┌───────┘│
                          ↓        │
                  ┌──────────────┐ │
                  │ dm_campaigns │ │
                  │──────────────│ │
                  │ id (PK)      │ │
                  │ launch_id FK │─┘
                  │ contact_id FK│
                  │ message      │
                  │ status       │
                  └──────────────┘
```

## Technology Stack

### Backend
- **Runtime**: Node.js 20+
- **Language**: TypeScript 5.3+
- **Framework**: Express.js
- **Database**: PostgreSQL 16+
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Logging**: Pino
- **Queue**: BullMQ (planned)
- **Cache**: Redis (planned)

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Data Fetching**: SWR
- **Charts**: Recharts

## Security Measures

### Input Validation
- Zod schemas for all API inputs
- Type-safe validation at runtime
- SQL injection prevention via ORM

### Environment Variables
- Validated on startup
- Never committed to Git
- Type-safe access via Zod

### Rate Limiting
- Configurable per endpoint
- Redis-backed (planned)

### CORS
- Configured to specific frontend URL
- Credentials support

### Headers
- Helmet.js for security headers
- CSP, XSS protection, etc.

## Performance Optimizations

### Database
- Indexes on frequently queried columns
- Connection pooling (max 20 connections)
- Prepared statements via Drizzle

### API
- Pagination (limit/offset)
- Selective field loading
- Caching (planned with Redis)

### Frontend
- Server Components (Next.js)
- SWR for client-side caching
- Code splitting
- Image optimization

## Testing Strategy (Planned)

### Unit Tests
- Domain services (pure logic)
- Use cases (business logic)
- Utility functions

### Integration Tests
- Repository implementations
- API endpoints
- Database operations

### E2E Tests
- Critical user flows
- Dashboard functionality

## Deployment Architecture (Planned)

```
┌─────────────┐
│   Vercel    │  ← Next.js Frontend
└─────────────┘
       ↓ HTTP
┌─────────────┐
│  Railway    │  ← Node.js API
└─────────────┘
       ↓
┌─────────────┐
│ PostgreSQL  │  ← Supabase/Railway
└─────────────┘

┌─────────────┐
│   Upstash   │  ← Redis (Cache/Jobs)
└─────────────┘
```

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Session data in Redis
- Database connection pooling

### Vertical Scaling
- Efficient queries with indexes
- Pagination for large datasets
- Lazy loading

### Background Jobs
- BullMQ for async operations
- Scheduled scraping tasks
- Email/notification queue

## Monitoring & Logging

### Logging
- Pino for structured JSON logs
- Different levels (debug, info, error)
- Request/response logging

### Error Tracking
- Sentry integration (planned)
- Error aggregation
- Stack traces in development

### Metrics
- API response times
- Database query performance
- Job queue metrics

## Future Enhancements

1. **GraphQL API**: Alternative to REST
2. **WebSockets**: Real-time updates
3. **Elasticsearch**: Full-text search
4. **Microservices**: Split scrapers into separate services
5. **Kubernetes**: Container orchestration
