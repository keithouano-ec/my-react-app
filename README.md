# my-react-app

A production-ready React application scaffold following modern 2025 best practices.

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript (strict) |
| Build Tool | Vite |
| Routing | React Router DOM v6 |
| Global State | Zustand |
| Server State | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Unit Testing | Jest + React Testing Library |
| E2E Testing | Playwright |
| Linting | ESLint (flat config) |
| Formatting | Prettier |
| CI/CD | Bitbucket Pipelines |

---

## 📁 Project Structure

```
src/
├── app/                  # App-level setup (router, providers)
├── components/           # Shared reusable UI components
├── features/             # Feature modules
│   └── <feature>/
│       ├── components/   # Feature-specific components
│       ├── hooks/        # Feature-specific hooks
│       ├── services/     # API calls
│       ├── store/        # Zustand store slices
│       ├── types/        # TypeScript types
│       └── index.ts      # Public barrel export
├── hooks/                # Shared custom hooks
├── lib/                  # Third-party config/wrappers
├── types/                # Global TypeScript types
├── utils/                # Pure utility functions
└── assets/               # Images, fonts, icons
```

> See [`docs/state-management.md`](./docs/state-management.md) for detailed patterns on Zustand, TanStack Query, and React Hook Form + Zod.

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 20.0.0`
- npm `>= 10.0.0`

### Installation

```bash
npm install
```

### Development server

```bash
npm run dev
# App runs at http://localhost:3000
```

### Production build

```bash
npm run build
# Output in /dist
```

### Preview production build locally

```bash
npm run preview
# Preview at http://localhost:4173
```

---

## 🧪 Testing

### Run all unit tests

```bash
npm test
```

### Watch mode

```bash
npm run test:watch
```

### Coverage report

```bash
npm run test:coverage
# Coverage report output in /coverage
```

> Minimum coverage thresholds: **80% branches, functions, lines, statements** — enforced in CI.

### E2E tests (Playwright)

```bash
# Install browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e

# Open Playwright UI mode
npm run test:e2e:ui
```

---

## 🔍 Linting & Formatting

```bash
# Lint
npm run lint

# Lint and auto-fix
npm run lint:fix

# Format all files
npm run format

# Check formatting (used in CI)
npm run format:check

# TypeScript type check
npm run typecheck
```

---

## 🔄 CI/CD — Bitbucket Pipelines

The [`bitbucket-pipelines.yml`](./bitbucket-pipelines.yml) pipeline runs automatically:

| Trigger | Steps |
|---------|-------|
| Any PR | Install → TypeCheck + Lint + Test (parallel) → Build |
| Merge to `main` | Install → TypeCheck + Lint + Test (parallel) → Build → 🔴 Deploy to Production *(manual)* |
| Merge to `develop` | Install → TypeCheck + Lint + Test (parallel) → Build → Deploy to Staging |

---

## 📐 Coding Standards

This project uses [GitHub Copilot Instructions](./.github/copilot-instructions.md) to enforce coding standards. Key rules:

- ✅ **Arrow functions only** — no `function` keyword for components or hooks
- ✅ **Feature-based folder structure** — features are self-contained with a public `index.ts`
- ✅ **TypeScript strict mode** — no `any`, no `@ts-ignore` without justification
- ✅ **Every component must have a test** — co-located `.test.tsx` files required
- ✅ **Semantic HTML + ARIA** — accessibility is a first-class concern
- ✅ **No cross-feature imports** — always import from a feature's `index.ts`

---

## 🔑 Environment Variables

Create a `.env.local` file in the root (never commit this):

```env
VITE_API_BASE_URL=https://your-api.example.com/api
```

All environment variables must be prefixed with `VITE_` to be exposed to the client.

---

## 📚 Further Reading

- [State Management Guide](./docs/state-management.md)
- [React Docs](https://react.dev)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://zustand-demo.pmnd.rs)
- [Zod Docs](https://zod.dev)
- [React Hook Form Docs](https://react-hook-form.com)
- [Vite Docs](https://vitejs.dev)
