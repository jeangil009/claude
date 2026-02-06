# Earned Value Management (EVM) App

## Project Overview
Aplicacion React de Valor Ganado (EVM) para gestion de proyectos de construccion, implementando estandares PMBOK y ANSI/EIA-748.

## Tech Stack
- TypeScript ~5.9.3, React 19, Vite 7.x
- Tailwind CSS v4 (via @tailwindcss/vite plugin, no tailwind.config.js needed)
- Recharts for charts, Lucide React for icons, date-fns for dates

## Commands
- `npm run dev` - Start dev server
- `npm run build` - TypeScript check + Vite production build
- `npm run lint` - ESLint
- `npm run preview` - Preview production build

## Code Conventions
- Components are defined as named function exports (`export function ComponentName`)
- React components used as render props (e.g., Tooltip `content`) must be defined OUTSIDE the parent component to avoid the `react-hooks/static-components` error
- Avoid `any` types - use proper interfaces for tooltip payloads and similar patterns
- Remove unused imports/variables - ESLint strict mode is enabled
- Currency formatting uses `Intl.NumberFormat` with 'es-MX' locale
- Spanish language throughout UI strings

## Project Structure
- `src/components/charts/` - Recharts visualizations (SCurve, Variance, Projection, etc.)
- `src/components/dashboard/` - Dashboard cards, metrics, health indicators
- `src/components/forms/` - Activity forms, tables, project settings
- `src/components/layout/` - Header
- `src/hooks/` - Custom hooks (useProject for state management)
- `src/types/` - TypeScript type definitions
- `src/utils/` - EVM calculation utilities
- `src/data/` - Sample project data
