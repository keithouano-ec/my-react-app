# State Management Guide

This document covers the three pillars of state management in this project:

1. **Zustand** — global/shared client state
2. **TanStack Query** — server/API state
3. **React Hook Form + Zod** — form state and validation

---

## 1. Zustand — Global Client State

Use Zustand for state that is shared across multiple components or features (e.g. auth session, UI theme, notifications).

### Setup

```bash
npm install zustand
```

### Creating a store

Stores live in `features/<feature>/store/` or `app/store/` for global state.

```ts
// features/auth/store/authStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { User } from '@/features/auth';

type AuthState = {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  clearAuth: () => void;
};

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        setUser: (user, token) => set({ user, token }),
        clearAuth: () => set({ user: null, token: null }),
      }),
      { name: 'auth-storage' }, // persisted to localStorage
    ),
    { name: 'AuthStore' },
  ),
);

export default useAuthStore;
```

### Consuming the store

```tsx
// Always select only the slice you need to minimise re-renders
const user = useAuthStore((state) => state.user);
const clearAuth = useAuthStore((state) => state.clearAuth);
```

### Rules
- One store per feature domain.
- Use `devtools` middleware in development for Redux DevTools support.
- Use `persist` middleware only when the state must survive a page refresh.
- Never put server/API data in Zustand — use TanStack Query for that.
- Keep actions (setters) inside the store, not scattered across components.

---

## 2. TanStack Query — Server / API State

Use TanStack Query for all data fetching, caching, background refetching, and mutations.

### Setup

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

```tsx
// app/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default App;
```

### Query hooks

Define query hooks inside `features/<feature>/hooks/`.

```ts
// features/users/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';

import { userKeys } from '../services/userKeys';
import { fetchUsers } from '../services/userApi';
import type { User } from '../types/user.types';

const useUsers = () => {
  return useQuery<User[]>({
    queryKey: userKeys.lists(),
    queryFn: fetchUsers,
  });
};

export default useUsers;
```

### Query key factory (always use this pattern)

```ts
// features/users/services/userKeys.ts
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};
```

### Mutations

```ts
// features/users/hooks/useCreateUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { userKeys } from '../services/userKeys';
import { createUser } from '../services/userApi';
import type { CreateUserPayload } from '../types/user.types';

const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => {
      // Invalidate and refetch the users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

export default useCreateUser;
```

### Rules
- Always use query key factories — never inline raw arrays.
- Define `staleTime` per query if it differs from the default.
- Use `onSuccess`, `onError`, `onSettled` callbacks in mutations for side effects.
- Never store query data in Zustand — let TanStack Query own the cache.

---

## 3. React Hook Form + Zod — Form State & Validation

### Setup

```bash
npm install react-hook-form zod @hookform/resolvers
```

### Schema definition (co-locate with the form)

```ts
// features/auth/components/LoginForm/loginForm.schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
```

### Form component

```tsx
// features/auth/components/LoginForm/LoginForm.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import useLogin from '../../hooks/useLogin';
import { loginSchema } from './loginForm.schema';
import type { LoginFormValues } from './loginForm.schema';

const LoginForm = () => {
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: LoginFormValues) => {
    login(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && <span role="alert">{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register('password')} />
        {errors.password && <span role="alert">{errors.password.message}</span>}
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  );
};

export default LoginForm;
```

### Testing forms

```tsx
// LoginForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import LoginForm from './LoginForm';

describe('LoginForm', () => {
  it('shows validation errors on empty submit', async () => {
    render(<LoginForm />);
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));
    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
    expect(await screen.findByText(/at least 8 characters/i)).toBeInTheDocument();
  });

  it('submits with valid values', async () => {
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'Password1!');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));
    await waitFor(() => {
      // assert mutation was called or navigation happened
    });
  });
});
```

### Rules
- Always co-locate the Zod schema with its form.
- Use `z.infer<typeof schema>` to derive TypeScript types — no duplication.
- Use `noValidate` on `<form>` to disable native browser validation.
- Use `role="alert"` on error messages for accessibility.
- Never manage form state manually with `useState` — always use RHF.

---

## Summary: Which tool for which state?

| State Type | Tool |
|---|---|
| Component-local UI state | `useState` / `useReducer` |
| Shared global UI state (theme, auth session, modals) | Zustand |
| Server data (fetching, caching, mutations) | TanStack Query |
| Form state and validation | React Hook Form + Zod |
