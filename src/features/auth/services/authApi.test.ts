import { authApi } from './authApi';

describe('authApi', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('login', () => {
    it('returns auth response on success', async () => {
      const mockResponse = {
        user: { id: '1', name: 'Jane Doe', email: 'jane@example.com', role: 'user' },
        token: 'mock-token',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await authApi.login({ email: 'jane@example.com', password: 'Password1!' });
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({ method: 'POST' }),
      );
    });

    it('throws an error when response is not ok', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Invalid credentials' }),
      });

      await expect(
        authApi.login({ email: 'wrong@example.com', password: 'wrongpass' }),
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('logout', () => {
    it('calls the logout endpoint', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
      await authApi.logout();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/logout'),
        expect.objectContaining({ method: 'POST' }),
      );
    });
  });
});
