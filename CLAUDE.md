# CLAUDE.md — Logistics Tracker Instructions

This project is a Next.js 15 app for tracking rider earnings (Grab, Bolt, Lalamove).

## Tech Stack
- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Icons: Lucide React
- Database: Supabase
- Charts: Recharts

## Code Style & Rules
- Use Functional Components and Hooks.
- Prefer Tailwind for all styling.
- Use `lucide-react` for icons.
- All database operations should go through `src/lib/supabase/client.ts`.
- Maintain the "Rider Pro" Dark Mode theme (`bg-[#0F172A]`).

## Database Schema (Supabase)
Table: `earnings`
- `id`: uuid (PK)
- `date`: date
- `app`: enum ('Grab', 'Bolt', 'Lalamove')
- `amount`: decimal
- `trips`: integer
- `notes`: text
- `created_at`: timestamp

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Typecheck: `npx tsc --noEmit`
