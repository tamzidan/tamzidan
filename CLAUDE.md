# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 portfolio website for Tamzidan Mahdiyin, featuring a full-stack architecture with PostgreSQL database (via Supabase), Prisma ORM, authentication, and interactive 3D components.

## Development Commands

### Core Development
- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Database Operations (Prisma)
- `npm run db:generate` - Generate Prisma Client (run after schema changes)
- `npm run db:migrate` - Create and apply migrations
- `npm run db:push` - Push schema changes directly to database (no migration)
- `npm run db:studio` - Open Prisma Studio GUI
- `npm run db:seed` - Seed database with initial data

### Deployment
- `npm run vercel-build` - Build command for Vercel (includes Prisma generation)

## Architecture Overview

### Application Structure
- **Next.js App Router**: All routes in `app/` directory (Next.js 14)
- **API Routes**: Located in `app/api/` with REST endpoints
- **Components**: Located in `app/components/` (client-side React components)
- **Context Providers**: `app/contexts/` for global state (Theme, Navbar, Admin)
- **Database Layer**: Prisma client singleton in `lib/prisma.js`

### Key Architectural Patterns

**1. Database Access Pattern**
- Always import Prisma client from `lib/prisma.js` (singleton pattern)
- Usage: `import { prisma } from '../../../../lib/prisma';`
- Never instantiate PrismaClient directly in routes/components

**2. Context Provider Hierarchy** (app/layout.js)
```
ThemeProvider → NavbarProvider → AdminProvider → {children}
```
All client components can access these contexts

**3. API Route Structure**
- All API routes return NextResponse.json()
- Authentication uses JWT tokens (jsonwebtoken)
- Admin authentication via `/api/auth/login` and `/api/auth/verify`

### Database Schema (Prisma)

**Models:**
- `Admin` - Admin users with bcrypt-hashed passwords
- `ContactMessage` - Contact form submissions with read/unread status
- `Comment` - User comments with visibility toggle, likes, and nested replies
- `CommentReply` - Nested replies to comments with admin flag
- `Portfolio` - Project portfolio items with technologies array and featured flag
- `Certificate` - Certifications with PDFs and images

**Important Relations:**
- `Comment.replies` → `CommentReply[]` (CASCADE delete)
- Use `technologies` as String[] for tech stack arrays

### Environment Variables Required

```
DATABASE_URL=          # PostgreSQL connection string
DIRECT_URL=           # Direct database connection (for migrations)
JWT_SECRET=           # Secret for JWT token signing
```

### Frontend Technology Stack

**3D & Animation:**
- Spline for 3D scenes (can be toggled off via FaCube button)
- Framer Motion for animations and transitions
- GSAP for complex animations
- react-three/fiber, drei, rapier for Three.js integration

**Styling:**
- Tailwind CSS with custom theme (light/dark mode via ThemeContext)
- Custom fonts: Inter (body), "moderniz" and "cascadia" fonts
- Color scheme: Cyan (#00ffdc) as primary accent color

**State Management:**
- React Context API for global state
- `ThemeContext` - Manages light/dark theme with localStorage persistence
- `NavbarContext` - Controls navbar visibility/state
- `AdminContext` - Handles admin authentication state

### Important Implementation Details

**1. Client Components**
Most components are client-side ('use client') due to:
- Framer Motion animations
- React hooks (useState, useEffect)
- Context consumption

**2. 3D Asset Toggle**
- State managed in main page.js: `is3dEnabled`
- Toggle button (FaCube) in top-right corner
- Falls back to static image when disabled

**3. Authentication Flow**
- Login: POST `/api/auth/login` → Returns JWT token
- Verify: POST `/api/auth/verify` → Validates JWT token
- Token stored client-side (typically localStorage via AdminContext)
- Protected routes check token via verify endpoint

**4. Image Handling**
- Next.js Image component with custom domains configured
- Remote patterns allow any HTTPS domain
- Custom webpack config for .glb/.gltf 3D model files

### Common Development Workflows

**Adding New Database Model:**
1. Edit `prisma/schema.prisma`
2. Run `npm run db:migrate` (for production) or `npm run db:push` (for dev)
3. Prisma Client auto-regenerates

**Creating New API Endpoint:**
1. Create `app/api/[endpoint]/route.js`
2. Export async functions: GET, POST, PUT, DELETE
3. Import prisma client from `lib/prisma.js`
4. Return NextResponse.json()

**Adding New Component:**
1. Create in `app/components/[ComponentName].jsx`
2. Add 'use client' directive if using hooks/motion
3. Import in parent component or page

### Testing & Debugging

- Use Prisma Studio (`npm run db:studio`) to inspect/modify database
- Check API routes at http://localhost:3000/api/[endpoint]
- Browser DevTools for client-side debugging
- Console logs in API routes appear in terminal

### Performance Considerations

- 3D assets (Spline) are heavy - hence the toggle feature
- Images use Next.js Image component for optimization
- Framer Motion animations use GPU-accelerated transforms
- Prisma queries should include only necessary fields
