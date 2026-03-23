# Nanny Admin Dashboard

Admin frontend for managing the Nanny platform. This project is built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, NextAuth, and TanStack Query.

It includes:

- Admin authentication with credentials and OTP-based admin login flow
- Dashboard and analytics views
- User, team, listing, perk, course, resource, invoice, review, and subscription management
- API-backed data fetching with authenticated requests

## Tech Stack

- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS 4
- NextAuth
- TanStack Query
- Axios
- Radix UI

## Requirements

Make sure the following are available before running the project:

- Node.js 20 or newer
- `pnpm` package manager
- A running backend API for the admin panel
- Valid environment variables for auth and API access

Recommended:

- Node.js 20 LTS
- `pnpm` 9 or newer

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Create environment file

Create a `.env.local` file in the project root.

Example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXTAUTH_SECRET=replace-with-a-long-random-secret

# Optional: only needed if Google sign-in is enabled
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Optional fallback if your setup uses public-prefixed values
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=
```

## Environment Variables

### Required

- `NEXT_PUBLIC_API_BASE_URL`
  Base URL of the backend API used by the admin frontend.

- `NEXTAUTH_SECRET`
  Secret used by NextAuth and route protection middleware.

### Optional

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_GOOGLE_CLIENT_SECRET`

These are only needed if you want Google authentication enabled.

## Run the Project

Start the development server:

```bash
pnpm dev
```

The app will usually be available at:

```text
http://localhost:3000
```

## Production

Build the project:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

## Linting

Run ESLint:

```bash
pnpm lint
```

## Authentication Notes

- Standard sign-in page: `/signin`
- Admin login page: `/admin/login`
- Admin login uses a two-step flow:
  email/password, then OTP verification
- Protected routes require a valid authenticated session
- Only `admin` and `moderator` roles can access protected areas

## Main Admin Sections

- Dashboard
- Analytics
- Users
- Team
- Listings
- Perks
- Courses
- Resources
- Reviews
- Subscriptions
- Invoices

## Project Structure

```text
src/
  app/           Next.js app routes
  components/    UI and feature components
  hooks/         React Query and UI hooks
  services/      API service layer
  types/         TypeScript models
  validation/    Validation schemas and auth typings
  data/          Static route and content data
  lib/           Shared utilities
```

## Notes

- This frontend depends on backend endpoints for login, profile lookup, analytics, users, courses, resources, subscriptions, and other admin modules.
- `pnpm-lock.yaml` is present, so `pnpm` is the expected package manager for this repository.
- Do not commit real secrets in `.env.local`.

## Quick Start

```bash
pnpm install
```

```bash
pnpm dev
```

Then open `http://localhost:3000`.


SecurePassword123! admin@nannyplug.com