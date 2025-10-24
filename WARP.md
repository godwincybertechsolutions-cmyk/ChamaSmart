# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Essential Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Format code with Prettier
npm run format
```

### Testing Commands

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run a single test file
npx vitest run path/to/test.test.ts

# Run tests in watch mode for a specific file
npx vitest watch path/to/test.test.ts
```

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS v4 with custom design tokens
- **State Management**: Zustand for global state, React Query (TanStack) for server state
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Custom components built with Radix UI primitives
- **Testing**: Vitest with React Testing Library

### Directory Structure

```
app/                    # Next.js App Router pages and API routes
├── api/               # API route handlers
│   └── mpesa/        # MPesa integration endpoints (STK push, callbacks)
├── auth/             # Authentication flow pages (signin with OTP)
└── dashboard/        # Protected dashboard pages

components/            # Reusable React components
├── ui/               # Base UI components (buttons, forms, modals)
└── layouts/          # Layout wrappers (DashboardLayout, AuthLayout)

features/             # Feature-specific modules with co-located logic
├── auth/            # Authentication components and hooks
├── dashboard/       # Dashboard widgets and charts (using Recharts)
└── mpesa/           # MPesa payment flow components

stores/              # Zustand stores for global state management
services/            # API service layer (Axios-based)
hooks/               # Custom React hooks
lib/                 # Utility functions and helpers
types/               # TypeScript type definitions
i18n/                # Internationalization config (English/Swahili)
```

### Key Architectural Patterns

#### API Layer

- All API calls go through `services/` directory using Axios
- Base API configuration with timeout handling in service layer
- Mock MPesa endpoints available when `NEXT_PUBLIC_ENABLE_MOCK_MPESA=true`

#### State Management

- **Zustand** for client-side global state (auth, UI state)
- **React Query** for server state and data fetching
- **Jotai** atoms available for fine-grained reactive state

#### Form Handling

- React Hook Form for form state management
- Zod schemas for validation (co-located with forms)
- Form components in `components/ui/` with consistent error handling

#### Authentication Flow

1. Phone number input → OTP request
2. OTP verification → JWT token storage
3. Protected routes use middleware for auth checks
4. Auth state managed in Zustand store

#### MPesa Integration

- Development: Mock endpoints in `/api/mpesa/`
- Production: Requires backend with Daraja API integration
- STK Push flow for payments
- Polling mechanism for payment status

### Code Quality Tools

#### Pre-commit Hooks (Husky + lint-staged)

Automatically runs on git commit:

- ESLint fixes for `.js`, `.jsx`, `.ts`, `.tsx` files
- Prettier formatting for all supported files
- Commitlint for conventional commit messages

#### Commit Convention

Follow conventional commits format:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Maintenance tasks

### Environment Configuration

Required environment variables for development:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_ENABLE_MOCK_MPESA=true

# Production MPesa credentials (when ready)
NEXT_PUBLIC_MPESA_CONSUMER_KEY=
NEXT_PUBLIC_MPESA_CONSUMER_SECRET=
NEXT_PUBLIC_MPESA_SHORTCODE=
NEXT_PUBLIC_MPESA_PASSKEY=
NEXT_PUBLIC_MPESA_CALLBACK_URL=
```

### Design System

#### Tailwind Configuration

- Custom color tokens: Primary, Accent, Neutral, Success, Warning, Danger
- Typography: Inter font family
- Border radius: 2xl (1rem) for modern rounded corners
- Responsive breakpoints following Tailwind defaults

#### Component Library

- Base components in `components/ui/` using Radix UI
- Consistent use of `clsx` and `tailwind-merge` for className composition
- Dark mode support via `next-themes`

### Testing Strategy

- Unit tests for utilities and hooks using Vitest
- Component tests using React Testing Library
- Test setup file at `test/setup.ts`
- Mock service layer for isolated component testing

### TypeScript Configuration

- Strict mode enabled
- Path alias `@/*` maps to project root
- Module resolution set to `bundler` for Next.js compatibility
- Target ES2017 for broad compatibility

### Performance Considerations

- Mobile-first design optimized for low-bandwidth
- Lazy loading for dashboard charts (Recharts)
- Framer Motion for performant animations
- React Hot Toast for lightweight notifications
