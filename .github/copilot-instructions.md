# Copilot Instructions for HomeAway

## Project Overview

**HomeAway** is a Next.js 14 Airbnb-style property rental application. It's an SSR/SSG application with client-side interactivity using React 18, styled with Tailwind CSS, and leveraging shadcn/ui component library. The app integrates Clerk for authentication, Supabase for data storage, Stripe for payments, and Leaflet for map functionality.

## Architecture & Key Patterns

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI**: Shadcn/ui (Radix UI primitives + Tailwind CSS)
- **Authentication**: Clerk
- **Database**: Supabase (managed via @prisma/client)
- **Payments**: Stripe
- **Maps**: Leaflet + react-leaflet
- **Charts**: Recharts
- **State Management**: Zustand
- **Theme**: next-themes with dark mode support via class

### Project Structure

```
/app - App Router pages and layouts (7-page layout)
/components - Reusable UI components
  /ui - shadcn/ui primitives (100% Radix-based)
  /navbar - Navigation components (Logo, DarkMode, UserIcon, NavSearch, etc.)
  /card, /form, /home, /properties - Feature-specific components
/lib - Utilities (cn() for class merging)
/utils - App-level helpers (links.ts for nav routes)
/hooks - Custom React hooks
/public - Static assets
```

### Protected Routes Pattern

Routes are protected via Clerk middleware in `middleware.ts`:

- `/bookings`, `/checkout`, `/favorites`, `/profile`, `/rentals`, `/reviews` require auth
- Middleware uses `createRouteMatcher()` and `auth().protect()` to enforce protection
- Home (`/`) and properties list are public

### Provider Architecture

- **Providers wrapper** (`app/providers.tsx`): Client component wrapping all children
- **Theme provider** via `next-themes` (defaultTheme: 'system', class-based)
- **Clerk provider** at root layout (wraps everything)
- Pattern: ClerkProvider → html → Providers (ThemeProvider) → Navbar + main

## Critical Developer Workflows

### Commands

```sh
npm run dev      # Start dev server (localhost:3000)
npm run build    # Build: runs prisma generate, then next build
npm start        # Production start
npm run lint     # ESLint validation
```

### Build Process

`npm run build` performs **two steps**:

1. `npx prisma generate` - Generate Prisma client
2. `next build` - Build Next.js app

When working with database changes, ensure Prisma client is regenerated before building.

## Code Conventions

### Class Name Utility

Use the `cn()` utility from `lib/utils.ts` for conditional Tailwind classes:

```tsx
import { cn } from "@/lib/utils";
cn("px-2", isActive && "font-bold", className);
```

This uses `clsx` + `tailwindMerge` to handle CSS conflicts safely.

### TypeScript Path Aliases

- `@/*` maps to root (configured in tsconfig.json)
- Always use `@/` imports (e.g., `@/components/ui/button`, `@/lib/utils`)

### Component Organization

- Shadcn/ui components live in `/components/ui` - **do not modify**
- Feature components in `/components/{feature}/` (navbar, properties, card, form, home)
- One component per file with clear responsibilities
- Use 'use client' for client components

### Navigation Links

All main navigation links defined in `utils/links.ts` - update here to modify navbar links.

## Integration Points & Dependencies

### Clerk Integration

- Middleware enforces route protection
- `<SignOutLink>` component handles auth flow
- `<UserIcon>` displays user info (references Clerk user object)
- Images from `img.clerk.com` whitelisted in next.config.mjs

### Supabase Integration

- Remote image domain `virmjpqxaajeqwjohjll.supabase.co` whitelisted for Next.js image optimization
- Prisma ORM interfaces with Supabase backend
- Database queries typically in server components or API routes

### Stripe Integration

- `stripe` and `@stripe/react-stripe-js` packages included
- Checkout page `/app/checkout/page.tsx` handles payment flow
- Integration follows standard Stripe React patterns

### Leaflet Maps

- `react-leaflet` wraps Leaflet for React integration
- Used in property detail/list views
- Configure map layers and markers in property components

## Special Configuration Notes

### Image Optimization

Next.js image remote patterns configured for:

1. `img.clerk.com` - Clerk user avatars
2. `virmjpqxaajeqwjohjll.supabase.co` - Property photos and assets

Add new image domains to `next.config.mjs` `remotePatterns` array.

### Hydration Safety

- Root layout has `suppressHydrationWarning` on `<html>` tag (theme provider requires this)
- Ensures dark mode provider doesn't cause hydration mismatches

### Theme System

- CSS variables (HSL) for all colors in tailwind.config.ts
- `next-themes` handles class-based switching
- Light/dark mode color overrides configured in theme files

## Testing & Debugging

- No test framework configured yet - tests not part of current workflow
- Use `npm run lint` to validate code
- Dev server hot-reloading enabled for rapid iteration
- Browser DevTools for React component inspection
