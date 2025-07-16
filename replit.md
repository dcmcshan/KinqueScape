# Replit.md

## Overview

KinqueScape is a comprehensive web platform for designing, running, and marketing escape rooms with real-time room control and biometric monitoring. The platform features a marketing homepage, design tools (/design), business plan display (/plan), interactive dashboard (/dash), and Unity-based room control (/room/dungeon) with participant tracking via AmazFit Active 2 watches. Current focus is on creating a demo installation for a dungeon room while planning future franchising and DIY expansion.

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
- **Users**: Multi-role user system (admin, designer, master, participant, voyeur) with authentication
- **Escape Room Designs**: Canvas layouts, puzzles, props, atmosphere settings stored as JSONB
- **Business Plans**: Financial projections, marketing strategies, operations data stored as JSONB
- **Rooms**: Room management with status tracking, participant capacity, and 3D model paths
- **Room Participants**: Participant tracking with positioning, watch IDs, and session data
- **Room Devices**: IoT device management for lights, locks, cameras, sensors, and displays
- **Biometric Data**: Real-time heart rate, HRV, positioning, and battery data from AmazFit Active 2 watches
- **Room Events**: Event logging for room activities and participant interactions

#### Frontend Pages
- **Home Page**: Marketing homepage with KinqueScape branding and Tron-style dark theme
- **Design Page**: Interactive canvas for creating escape room layouts with drag-and-drop tools
- **Plan Page**: Displays the actual KinqueScape business plan focused on dungeon demo installation
- **Dashboard Page**: Interactive dashboard for monitoring room statistics and participant data
- **Room Control Page**: Unity WebGL 3D room visualization with real-time biometric monitoring and device controls
- **Responsive Sidebar**: Navigation between all platform tools

#### API Endpoints
- `GET/POST /api/designs` - Escape room design CRUD operations
- `GET/POST /api/plans` - Business plan CRUD operations
- `GET/POST /api/rooms` - Room management and control
- `GET/POST /api/rooms/:id/participants` - Participant tracking
- `GET/POST /api/rooms/:id/devices` - IoT device control
- `GET/POST /api/rooms/:id/biometrics` - Biometric data collection
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
- **Unity Integration**: react-unity-webgl for Unity WebGL embedding and communication

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

### Current Implementation Status
- **Completed**: Dark theme with red Tron-style accents across all pages
- **Completed**: Comprehensive biometric monitoring infrastructure for AmazFit Active 2 watches
- **Completed**: Room management system with Unity WebGL 3D visualization framework
- **Completed**: Business plan page displaying actual KinqueScape strategy focused on dungeon demo
- **Completed**: Multi-role user system with authentication and permissions
- **Completed**: In-memory storage with comprehensive database schema for future PostgreSQL migration
- **Completed**: React-Unity communication bridge with device/participant data flow
- **Completed**: Interactive device and participant tracking with real-time updates
- **Completed**: Enhanced Unity C# scripts for true 3D room architecture and GLB loading
- **FIXED**: Eliminated device flashing by implementing static 3D object creation
- **IMPROVED**: Unity C# scripts now create permanent 3D room structure with static geometry
- **READY**: GLB file (7_16_2025.glb) available for Unity 3D loading
- **ENHANCED**: Simplified rendering pipeline with static walls, floors, ceiling, and devices

### Architecture Focus
The application follows a clean architecture pattern with clear separation between presentation, business logic, and data layers. The shared schema approach ensures type safety across the full stack while the modular component structure supports easy feature additions and modifications.

### Demo Installation Strategy
Primary focus is on creating a comprehensive dungeon-themed demo installation that showcases:
- Real-time biometric monitoring with AmazFit Active 2 watches
- Unity 3D room visualization and control
- Participant stress level monitoring and safety protocols
- Dynamic puzzle difficulty adjustment based on biometric feedback
- Future expansion through franchising and DIY installation packages

The demo serves as proof-of-concept for the broader KinqueScape platform, demonstrating the technology's potential to revolutionize escape room experiences through data-driven insights and immersive environments.