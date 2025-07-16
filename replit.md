# Replit.md

## Overview

This is a full-stack escape room design and business planning application built with React, Express, TypeScript, and PostgreSQL. The application allows users to create escape room designs with interactive canvas tools and develop comprehensive business plans for escape room ventures.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state, local React state for UI
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with JSON responses
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Storage**: In-memory storage with interface for easy swapping

### Key Components

#### Database Schema
- **Users**: Basic user authentication with username/password
- **Escape Room Designs**: Canvas layouts, puzzles, props, atmosphere settings stored as JSONB
- **Business Plans**: Financial projections, marketing strategies, operations data stored as JSONB

#### Frontend Pages
- **Design Page**: Interactive canvas for creating escape room layouts with drag-and-drop tools
- **Business Plan Page**: Multi-section forms for creating comprehensive business plans
- **Responsive Sidebar**: Navigation between design and planning tools

#### API Endpoints
- `GET/POST /api/designs` - Escape room design CRUD operations
- `GET/POST /api/plans` - Business plan CRUD operations
- All endpoints use userId=1 for demo purposes (no authentication implemented)

## Data Flow

1. **Frontend** makes API calls using TanStack Query for caching and state management
2. **Express server** validates requests using Zod schemas from shared directory
3. **Storage layer** currently uses in-memory storage but implements interface for database swapping
4. **Drizzle ORM** configured for PostgreSQL with migrations support
5. **Shared schemas** ensure type safety between frontend and backend

## External Dependencies

### Core Dependencies
- **Database**: Neon serverless PostgreSQL (@neondatabase/serverless)
- **ORM**: Drizzle ORM with Zod integration for validation
- **UI Framework**: Extensive Radix UI component library
- **Styling**: Tailwind CSS with PostCSS processing
- **Forms**: React Hook Form with Hookform resolvers

### Development Tools
- **Replit Integration**: Vite plugins for Replit development environment
- **Error Handling**: Runtime error modal for development
- **Code Quality**: TypeScript strict mode with comprehensive type checking

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations in `migrations/` directory

### Environment Configuration
- **Development**: Uses tsx for TypeScript execution with hot reload
- **Production**: Compiled JavaScript with NODE_ENV=production
- **Database**: Requires DATABASE_URL environment variable for PostgreSQL connection

### Current Limitations
- No user authentication system (uses hardcoded userId=1)
- In-memory storage for demo - requires database setup for persistence
- No deployment configuration for production hosting

The application follows a clean architecture pattern with clear separation between presentation, business logic, and data layers. The shared schema approach ensures type safety across the full stack while the modular component structure supports easy feature additions and modifications.