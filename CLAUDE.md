# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- Start development server: `npm run dev`
- Build for production: `npm run build`
- Start production server: `npm run start`
- Lint code: `npm run lint`

The development server runs at http://localhost:3000 by default.

## Project Structure

This is a Next.js 16.2.6 application using the App Router with TypeScript and Tailwind CSS.

### Key Directories

- `app/` - Contains all pages and route groups using the Next.js App Router
  - `app/page.tsx` - Landing page (home route)
  - `app/dashboard/page.tsx` - Dashboard interface
  - `app/terms/page.tsx` - Terms and conditions page
  - `app/privacy/page.tsx` - Privacy policy page
  - `app/layout.tsx` - Root layout with global CSS and font setup
  - `app/globals.css` - Global stylesheet

- `components/` - Reusable UI components
  - `components/layout/` - Navbar and Footer components
  - `components/sections/` - Section-specific components (e.g., HeroCarousel)
  - `components/ui/` - Shared UI components (LandingCards, etc.)
  - Feature-specific components: `categoryProgress.tsx`, `transactionItem.tsx`, `statCard.tsx`, `navItem.tsx`

### Technology Stack

- **Framework**: Next.js 16.2.6 (React 19.2.4)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom CSS in globals.css
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React hooks (useState) - no external state library

### Architecture Notes

1. **Routing**: Uses Next.js App Router with file-system based routing
2. **Styling**: Primarily Tailwind utility classes with some custom CSS for background effects
3. **Components**: Follows a combination of atomic and feature-based organization
4. **Data Flow**: Current implementation uses static data and mockups; no backend integration visible
5. **Authentication**: Not implemented in the current codebase

### Common Development Tasks

- To modify the landing page: Edit `app/page.tsx` and related components in `components/ui/LandingCards.tsx` and `components/sections/HeroCarousel.tsx`
- To modify the dashboard: Edit `app/dashboard/page.tsx` and related components in the components directory
- To add new routes: Create new folders under `app/` with a `page.tsx` file
- To add shared components: Place in `components/ui/` or appropriate subdirectory
- To adjust styling: Modify Tailwind classes directly or edit `app/globals.css` for global styles

### Linting and Formatting

- ESLint is configured with `eslint-config-next` for Next.js and TypeScript
- Run `npm run lint` to check for linting errors
- No formatter is explicitly configured; rely on editor settings for Prettier or similar

### Deployment

- The application is configured for easy deployment to Vercel (default for Next.js)
- Build output is optimized via `next build` and `next start`
