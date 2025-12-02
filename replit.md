# EcoCollect - Urban Waste Management System

## Overview

EcoCollect is an intelligent urban waste management platform designed for municipalities to optimize waste collection operations. The system centralizes management of collection points, vehicles, employees, and routes while providing real-time monitoring, automated scheduling, and data-driven insights to reduce operational costs and environmental impact.

The platform addresses key municipal challenges:
- Inefficient collection route planning leading to excessive fuel consumption and CO2 emissions
- Lack of real-time container fill-level monitoring causing overflows
- Poor coordination between municipal services
- Limited visibility into performance metrics and recycling rates

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Components**: Shadcn/ui component library built on Radix UI primitives
- Material Design principles adapted for municipal operations
- Consistent spacing system using Tailwind utilities (2, 4, 6, 8, 12, 16)
- Typography: Inter for interface, Roboto Mono for data/metrics
- 12-column responsive grid layout with mobile-first approach
- Dark/light theme support via context provider

**State Management**: 
- TanStack Query (React Query) for server state management and caching
- Local component state with React hooks
- Custom query client configuration with infinite stale time and disabled auto-refetch

**Routing**: Wouter for client-side routing (lightweight alternative to React Router)

**Key UI Patterns**:
- Card-based layouts for entity display (collection points, vehicles, employees, routes)
- Interactive map using Leaflet for geospatial visualization
- Modal dialogs for create/edit operations
- Real-time notifications and alerts system
- Sidebar navigation with collapsible menu

### Backend Architecture

**Framework**: Express.js (Node.js) with TypeScript

**API Design**: RESTful HTTP endpoints organized by resource type
- `/api/collection-points` - CRUD operations for waste collection locations
- `/api/employees` - Workforce management
- `/api/vehicles` - Fleet management  
- `/api/routes` - Collection route planning and tracking
- `/api/alerts` - Critical notifications
- `/api/notifications` - User notifications
- `/api/dashboard/stats` - Aggregated metrics

**Data Access Layer**: Storage abstraction interface pattern
- Single `IStorage` interface defining all data operations
- Concrete implementation using Drizzle ORM
- Separation of database logic from HTTP handlers
- Consistent CRUD operations across all entities

**Build Strategy**: 
- ESBuild for server compilation with selective dependency bundling
- Allowlist approach for frequently-used dependencies to reduce syscalls
- Vite for client bundling with HMR in development

### Data Storage

**Database**: PostgreSQL via Neon serverless

**ORM**: Drizzle ORM with Drizzle-Kit for migrations
- Type-safe query builder
- Schema-first approach with Zod validation integration
- UUID primary keys generated server-side
- Schema location: `shared/schema.ts` for type sharing between client/server

**Core Tables**:
- `users` - Authentication and user accounts
- `collection_points` - Waste containers with geolocation, fill level, waste type
- `employees` - Workforce records with role, status, assigned zones
- `vehicles` - Fleet information with capacity, fuel, maintenance tracking
- `routes` - Collection schedules with assigned resources and progress tracking
- `alerts` - System-generated critical notifications
- `notifications` - User-facing messages

**Data Validation**: Zod schemas derived from Drizzle table definitions using `createInsertSchema`

### Authentication & Authorization

**Strategy**: Session-based authentication (infrastructure present but not fully implemented)
- Express sessions with PostgreSQL session store (connect-pg-simple)
- User credentials stored in database with hashed passwords
- Session cookies for maintaining authenticated state

### External Dependencies

**Mapping & Geolocation**:
- Leaflet.js for interactive map visualization
- Custom marker icons showing fill levels and container status
- Geospatial coordinates stored as latitude/longitude pairs

**UI Framework**:
- Radix UI primitives for accessible components
- Tailwind CSS for utility-first styling
- Class Variance Authority (CVA) for component variants
- Lucide React for consistent iconography

**Date/Time Handling**:
- date-fns for date formatting and manipulation

**Development Tools**:
- TypeScript for type safety across full stack
- ESLint and Prettier (implied by modern React setup)
- Replit-specific plugins for development experience

**Database Connection**:
- @neondatabase/serverless for PostgreSQL connectivity
- WebSocket constructor override for serverless compatibility
- Connection pooling via Neon's Pool interface

### Deployment Architecture

**Monorepo Structure**:
- `/client` - React frontend application
- `/server` - Express backend API
- `/shared` - TypeScript types and schemas shared between client/server
- `/migrations` - Database migration files

**Build Process**:
1. Client builds to `dist/public` via Vite
2. Server compiles to `dist/index.cjs` via ESBuild
3. Single deployment artifact serves both static files and API

**Environment Variables**:
- `DATABASE_URL` - PostgreSQL connection string (required)
- `NODE_ENV` - Environment flag (development/production)

**Static File Serving**: Express serves compiled React app with catch-all routing for SPA behavior

### Design Patterns

**Data Transformation Layer**: Separate frontend and backend type representations
- Database models use snake_case following SQL conventions
- Frontend models use camelCase following JavaScript conventions  
- Transform functions (`transformToFrontend`, `transformToBackend`) handle conversion
- Prevents tight coupling between API contracts and database schema

**Type Safety**: End-to-end TypeScript with shared types
- Database schema generates TypeScript types
- Zod schemas provide runtime validation
- API responses typed via shared schema definitions

**Component Organization**:
- Presentational components in `/components` (cards, forms, maps)
- Page-level components in `/pages` (dashboard, collection points, employees, etc.)
- Example components demonstrate usage patterns
- Shadcn/ui components in `/components/ui`

**Error Handling**:
- HTTP error responses with meaningful status codes
- Try-catch blocks in route handlers
- Client-side error boundaries (implied by React setup)
- Toast notifications for user feedback