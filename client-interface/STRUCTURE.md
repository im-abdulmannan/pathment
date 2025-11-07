# Pathment Client Interface

A modern Next.js 16 application built with TypeScript and Tailwind CSS.

## Project Structure

`
client-interface/
 app/                          # Next.js App Router
    layout.tsx                # Root layout
    page.tsx                  # Home page
    globals.css               # Global styles
 components/                   # Reusable components
    ui/                       # UI components (buttons, cards, etc.)
    layout/                   # Layout components (header, footer, etc.)
        Header.tsx
        Footer.tsx
 features/                     # Feature-based modules
    [feature-name]/           # Each feature gets its own folder
        components/           # Feature-specific components
        hooks/                # Feature-specific hooks
        utils/                # Feature-specific utilities
        types.ts              # Feature-specific types
 lib/                          # Shared utilities and configurations
    api/                      # API client and fetchers
    config/                   # App configuration
       site.ts
    hooks/                    # Shared custom hooks
    types/                    # Shared TypeScript types
       index.ts
    utils/                    # Shared utility functions
        cn.ts
 public/                       # Static assets
    assets/
        images/
        icons/
 .env.local                    # Environment variables (not committed)
 .env.example                  # Example environment variables
 next.config.ts                # Next.js configuration
 tailwind.config.ts            # Tailwind CSS configuration
 tsconfig.json                 # TypeScript configuration
 package.json                  # Dependencies and scripts
`

## Feature-Based Architecture

Each feature should be self-contained in its own folder under eatures/:

`
features/
 auth/
     components/
        LoginForm.tsx
        SignupForm.tsx
     hooks/
        useAuth.ts
     utils/
        validation.ts
     types.ts
`

## Getting Started

1. Install dependencies:
   `ash
   npm install
   `

2. Copy .env.example to .env.local and fill in your environment variables

3. Run the development server:
   `ash
   npm run dev
   `

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Scripts

- 
pm run dev - Start development server
- 
pm run build - Build for production
- 
pm start - Start production server
- 
pm run lint - Run ESLint

## Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Package Manager:** npm

## Coding Guidelines

1. **Feature-First Organization:** Keep related code together in feature folders
2. **Component Naming:** Use PascalCase for components (e.g., UserProfile.tsx)
3. **Type Safety:** Always use TypeScript types/interfaces
4. **Reusability:** Extract common UI components to components/ui
5. **Server Components:** Use Server Components by default, mark Client Components with 'use client'
