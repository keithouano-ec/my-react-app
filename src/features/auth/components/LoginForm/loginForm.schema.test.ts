import { loginSchema } from './loginForm.schema';

describe('loginSchema', () => {
  it('passes with valid values', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: 'Password1!' });
    expect(result.success).toBe(true);
  });

  it('fails with invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'Password1!' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toContain(
        'Please enter a valid email address',
      );
    }
  });

  it('fails with short password', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: '123' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toContain(
        'Password must be at least 8 characters',
      );
    }
  });
});
