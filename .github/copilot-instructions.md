# GitHub Copilot Instructions — React Production Standards

This file defines the coding standards and conventions for this React project. Copilot must follow these rules when generating or suggesting code.

---

## 🧱 Project Stack

- **React 18+** with **TypeScript** (strict mode)
- **Vite** as the build tool
- **Jest** + **React Testing Library** for unit/component testing
- **Playwright** for E2E testing
- **Zustand** for global state
- **TanStack Query (React Query)** for server/API state
- **React Hook Form** + **Zod** for forms and validation
- **ESLint** + **Prettier** for linting and formatting

---

## 📁 Folder Structure

Always follow a **feature-based folder structure**:

```
src/
├── app/                  # App-level setup (router, providers, store)
├── components/           # Shared reusable UI components
├── features/             # Feature modules
│   └── <feature>/
│       ├── components/   # Feature-specific components
│       ├── hooks/        # Feature-specific hooks
│       ├── services/     # API calls
│       ├── store/        # Zustand slices
│       ├── types/        # TypeScript types
│       └── index.ts      # Public API (barrel export)
├── hooks/                # Shared custom hooks
├── lib/                  # Third-party config/wrappers
├── types/                # Global types
├── utils/                # Pure utility functions
└── assets/
```

- Never cross-import between features directly — always go through the feature's `index.ts`.
- All shared components live in `src/components/`.

---

## ✍️ Code Style

### Always use arrow functions
```tsx
// ✅ Correct
const MyComponent = ({ title }: MyComponentProps) => {
  return <h1>{title}</h1>;
};

export default MyComponent;

// ❌ Never use function declarations for components or hooks
function MyComponent() { ... }
export default function MyComponent() { ... }
```

### TypeScript
- Always define prop types explicitly using `type` (prefer over `interface` for props)
- Enable and respect strict mode — no `any`, no `@ts-ignore` without justification
- Use `unknown` instead of `any` where type is truly unknown

### Naming Conventions
| Item | Convention | Example |
|------|-----------|--------|
| Component file | PascalCase | `UserCard.tsx` |
| Hook file | camelCase | `useAuth.ts` |
| Utility file | camelCase | `formatDate.ts` |
| Type/Interface | PascalCase | `UserCardProps` |
| Constants | SCREAMING_SNAKE | `MAX_RETRY_COUNT` |
| Test file | Same + `.test` | `UserCard.test.tsx` |

---

## 🧪 Testing — Required for Every Component

- **Every component, hook, and utility must have a co-located test file.**
- Use **Jest** + **React Testing Library**.
- Test **behaviour, not implementation**.
- Prefer queries by role/label/text over `data-testid`.

```tsx
// UserCard.test.tsx
import { render, screen } from '@testing-library/react';
import UserCard from './UserCard';

describe('UserCard', () => {
  it('renders name and email', () => {
    render(<UserCard name="Jane Doe" email="jane@example.com" />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });
});
```

- Minimum coverage: **80%** (enforced in CI)
- Always generate a `.test.tsx` alongside any new component.

---

## 🗃️ State Management

| Scope | Tool |
|-------|------|
| Local UI state | `useState`, `useReducer` |
| Global/shared state | Zustand |
| Server/API state | TanStack Query |
| Forms | React Hook Form + Zod |

- Never use prop drilling beyond 2 levels — lift to store or context.
- Define Zustand stores inside `features/<feature>/store/`.

---

## 📦 Imports

Order imports as follows (enforced by ESLint):
1. React / framework
2. Third-party libraries
3. Internal features/components (use `@/` alias)
4. Relative imports
5. Type imports

---

## 🔒 Security

- Never use `dangerouslySetInnerHTML` without sanitization (DOMPurify)
- Never commit secrets — use `.env` files and server-side handling
- Always validate user input with Zod schemas

---

## ♿ Accessibility

- Use semantic HTML elements
- All interactive elements must be keyboard-navigable
- Add `aria-label` where native semantics are insufficient

---

## 🚨 Error Handling

- Wrap feature sections in `<ErrorBoundary>` (react-error-boundary)
- Always show a user-friendly fallback UI
- Log errors to Sentry (or equivalent)

---

## ✅ CI Checklist (every PR must pass)

- [ ] `tsc --noEmit` — no TypeScript errors
- [ ] ESLint — zero errors
- [ ] Prettier — consistent formatting
- [ ] Jest unit tests with ≥80% coverage
- [ ] Playwright E2E smoke tests
- [ ] Bundle size check
