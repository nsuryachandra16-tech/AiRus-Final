# AiRus - AI College Assistant

## Overview

AiRus is an AI-powered college companion application designed to help students manage their academic life effectively. The platform provides comprehensive tools for assignment tracking, course scheduling, Pomodoro study sessions, and AI-powered tutoring through Google's Gemini AI. Built with a modern tech stack featuring React, Express, and PostgreSQL, the application emphasizes a calm, focused user experience with a distinctive dark glassmorphism design aesthetic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 19.2.0 with TypeScript for type-safe component development
- Vite as the build tool providing fast hot-module replacement and optimized production builds
- Wouter for lightweight client-side routing instead of React Router

**UI Component System:**
- Shadcn UI component library based on Radix UI primitives for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design tokens
- Dark mode by default with glassmorphism aesthetic (`backdrop-blur-[12px]`, `rgba(10, 10, 10, 0.25)` backgrounds)
- Custom color palette featuring warm yellow (#facc15) as primary accent, used sparingly for CTAs and important indicators
- System font stack for performance with JetBrains Mono for timer displays

**State Management:**
- TanStack React Query v5 for server state management, caching, and data synchronization
- React hooks for local component state
- No global state management library (Redux/Zustand) - relies on React Query's built-in caching and invalidation

**Design System:**
- Custom CSS variables defined for comprehensive theming support
- Glassmorphic cards with semi-transparent backgrounds and subtle borders
- Text hierarchy with three levels (primary, secondary, tertiary) for clear information architecture
- Semantic colors for assignment status (success, warning, error, info)

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for RESTful API endpoints
- Node.js runtime with ESM module system (type: "module")
- Middleware for JSON parsing, URL encoding, and request/response logging

**API Design:**
- RESTful endpoints organized by feature domain:
  - `/api/assignments` - CRUD operations for assignment management
  - `/api/schedule` - Course schedule and event management
  - `/api/study-sessions` - Pomodoro timer session tracking
  - `/api/chat` - AI tutor conversation management
- Standard HTTP methods (GET, POST, PATCH, DELETE) following REST conventions
- Zod schema validation using `drizzle-zod` for request validation
- Centralized error handling with status codes and error messages

**Data Layer:**
- Drizzle ORM for type-safe database queries and migrations
- Database storage abstraction through `IStorage` interface in `server/storage.ts`
- PostgreSQL as the primary database via Neon serverless driver
- WebSocket configuration for Neon serverless connections
- Schema defined in `shared/schema.ts` for type sharing between frontend and backend

**Database Schema:**
- `assignments` table: tracks tasks with course association, due dates, priority levels, completion status
- `scheduleEvents` table: recurring course schedule with day-of-week mapping (0-6), time ranges, location, color coding
- `studySessions` table: Pomodoro session tracking with session type (work/break), duration, completion timestamps
- `chatMessages` table: AI tutor conversation history with role-based messages (user/assistant)

### Development & Build

**Development Setup:**
- TypeScript configuration with strict mode, ESNext modules, and path aliases (`@/*`, `@shared/*`, `@assets/*`)
- Vite dev server with HMR and Replit-specific plugins (cartographer, dev banner, runtime error overlay)
- Server runs on `tsx` for TypeScript execution in development

**Build Process:**
- Frontend: Vite builds React app to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js` as ESM module
- Database migrations generated to `./migrations` directory via `drizzle-kit push`

**Code Organization:**
- Monorepo structure with client, server, and shared directories
- Client code in `client/src` with pages, components, hooks, and lib utilities
- Server code in `server` with routes, storage, database, and AI integration
- Shared code in `shared` for database schema and types accessible to both frontend and backend

## External Dependencies

### Third-Party Services

**Google Gemini AI:**
- Integration via `@google/genai` package
- Model: `gemini-2.5-flash` for AI tutoring responses
- System prompt configures the AI as a supportive college tutor with specific pedagogical behaviors
- API key required via `GEMINI_API_KEY` environment variable

**Neon Serverless PostgreSQL:**
- Database provider using `@neondatabase/serverless` package
- WebSocket-based connections for serverless environments
- Connection string required via `DATABASE_URL` environment variable
- Connection pooling through `pg-pool`

### UI Component Libraries

**Radix UI Primitives:**
- Comprehensive set of unstyled, accessible UI components
- Components used: accordion, alert-dialog, avatar, checkbox, dialog, dropdown-menu, hover-card, label, popover, progress, radio-group, scroll-area, select, separator, slider, switch, tabs, toast, tooltip
- Provides foundation for Shadcn UI component system

### Utility Libraries

**Form Handling:**
- `react-hook-form` for performant form state management
- `@hookform/resolvers` with Zod integration for schema validation

**Date Utilities:**
- `date-fns` for date formatting, manipulation, and relative time calculations
- Used for assignment due date displays and session tracking

**Styling:**
- `class-variance-authority` for type-safe variant-based component styling
- `clsx` and `tailwind-merge` for conditional CSS class composition
- `cmdk` for command palette functionality

**Build Tools:**
- `esbuild` for fast server-side bundling
- `autoprefixer` and `postcss` for CSS processing
- `drizzle-kit` for database migrations and schema management