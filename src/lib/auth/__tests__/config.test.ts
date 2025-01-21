// src/lib/auth/__tests__/config.test.ts

import { authOptions } from '../config';
import type { Session, Account } from 'next-auth';
import bcrypt from 'bcryptjs';
import type { JWT } from 'next-auth/jwt';
import type { AdapterUser } from 'next-auth/adapters';

interface MockUser extends AdapterUser {
  role: string;
}

describe('Auth Configuration', () => {
  const mockEnv = {
    ADMIN_EMAIL: 'admin@example.com',
    ADMIN_PASSWORD_HASH: '',
  };

  let originalEnv: NodeJS.ProcessEnv;

  beforeAll(async () => {
    // Generate a test password hash
    mockEnv.ADMIN_PASSWORD_HASH = await bcrypt.hash('testpassword123', 12);
    
    // Back up original env vars
    originalEnv = { ...process.env };
    
    // Set mock env vars
    process.env = { ...originalEnv, ...mockEnv };
  });

  afterAll(() => {
    // Restore original env vars
    process.env = originalEnv;
  });

  describe('Session Management', () => {
    it('should configure session with correct settings', () => {
      expect(authOptions.session).toEqual({
        strategy: 'jwt',
        maxAge: 2 * 60 * 60, // 2 hours
      });
    });

    it('should update session with user role', async () => {
      const mockUser: MockUser = {
        id: '1',
        email: mockEnv.ADMIN_EMAIL,
        emailVerified: null,
        role: 'admin'
      };

      const mockSession: Session = {
        user: mockUser,
        expires: new Date(Date.now() + 3600000).toISOString()
      };

      const mockToken = { role: 'admin' } as JWT;

      const newSession = await authOptions.callbacks?.session?.({
        session: mockSession,
        token: mockToken,
        user: mockUser,
        trigger: 'update',
        newSession: null
      });

      expect(newSession?.user).toBeDefined();
      expect(newSession?.user).toHaveProperty('role', 'admin');
    });

    it('should handle session expiry correctly', async () => {
      const mockUser: MockUser = {
        id: '1',
        email: mockEnv.ADMIN_EMAIL,
        emailVerified: null,
        role: 'admin'
      };

      const expiredSession: Session = {
        user: mockUser,
        expires: new Date(Date.now() - 1000).toISOString() // Expired session
      };

      const mockToken = { role: 'admin' } as JWT;

      const newSession = await authOptions.callbacks?.session?.({
        session: expiredSession,
        token: mockToken,
        user: mockUser,
        trigger: 'update',
        newSession: null
      });

      expect(newSession?.expires).toBeDefined();
      expect(new Date(newSession?.expires as string).getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe('Token Refresh', () => {
    it('should maintain role during token refresh', async () => {
      const mockUser: MockUser = {
        id: '1',
        email: mockEnv.ADMIN_EMAIL,
        emailVerified: null,
        role: 'admin'
      };

      const mockAccount: Account = {
        provider: 'credentials',
        type: 'credentials',
        providerAccountId: '1'
      };

      const initialToken = { email: mockEnv.ADMIN_EMAIL } as JWT;

      const refreshedToken = await authOptions.callbacks?.jwt?.({
        token: initialToken,
        user: mockUser,
        account: mockAccount,
        trigger: 'signIn'
      });

      expect(refreshedToken).toHaveProperty('role', 'admin');
    });

    it('should handle token rotation', async () => {
      // Simulate token refresh after halfway through session
      jest.useFakeTimers();
      const maxAge = authOptions.session?.maxAge ?? 0;
      const halfSessionTime = maxAge * 500; // Half of maxAge in ms
      
      const initialToken = { 
        email: mockEnv.ADMIN_EMAIL,
        role: 'admin',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + maxAge
      } as JWT;

      // Advance time
      jest.advanceTimersByTime(halfSessionTime);

      const mockUser: MockUser = {
        id: '1',
        email: mockEnv.ADMIN_EMAIL,
        emailVerified: null,
        role: 'admin'
      };

      const refreshedToken = await authOptions.callbacks?.jwt?.({
        token: initialToken,
        user: mockUser,
        account: null,
        trigger: 'update'
      });

      expect(Number(refreshedToken?.exp)).toBeGreaterThan(Number(initialToken.exp));
      
      jest.useRealTimers();
    });
  });

  describe('Role-Based Access', () => {
    it('should assign admin role during authentication', async () => {
      const credentials = {
        email: mockEnv.ADMIN_EMAIL,
        password: 'testpassword123'
      };

      const provider = authOptions.providers[0];
      if ('authorize' in provider) {
        const user = await provider.authorize?.(credentials, {});
        expect(user).toBeTruthy();
        expect((user as MockUser)?.role).toBe('admin');
      }
    });

    it('should deny access for non-admin users', async () => {
      const credentials = {
        email: 'user@example.com', // Non-admin email
        password: 'testpassword123'
      };

      const provider = authOptions.providers[0];
      if ('authorize' in provider) {
        const user = await provider.authorize?.(credentials, {});
        expect(user).toBeNull();
      }
    });

    it('should maintain role consistency across session updates', async () => {
      const mockUser: MockUser = {
        id: '1',
        email: mockEnv.ADMIN_EMAIL,
        emailVerified: null,
        role: 'admin'
      };

      const mockToken = { email: mockEnv.ADMIN_EMAIL, role: 'admin' } as JWT;
      const mockSession: Session = {
        user: {
          ...mockUser,
          name: undefined,
          image: undefined
        },
        expires: new Date(Date.now() + 3600000).toISOString()
      };

      // Test session callback
      const updatedSession = await authOptions.callbacks?.session?.({
        session: mockSession,
        token: mockToken,
        user: mockUser,
        trigger: 'update',
        newSession: null
      });

      expect((updatedSession?.user as MockUser)?.role).toBe('admin');

      // Test token callback
      const updatedToken = await authOptions.callbacks?.jwt?.({
        token: mockToken,
        user: mockUser,
        account: null,
        trigger: 'update'
      });

      expect(updatedToken?.role).toBe('admin');
    });    it('should prevent role escalation attempts', async () => {
      const mockUser: MockUser = {
        id: '1',
        email: mockEnv.ADMIN_EMAIL,
        emailVerified: null,
        role: 'admin'
      };

      const mockToken = { 
        email: mockEnv.ADMIN_EMAIL, 
        role: 'super-admin' // Attempting to escalate privileges
      } as JWT;

      const updatedToken = await authOptions.callbacks?.jwt?.({
        token: mockToken,
        user: mockUser,
        account: null,
        trigger: 'update'
      });

      expect(updatedToken?.role).toBe('admin'); // Should always be 'admin'
    });
  });

  describe('Error Handling', () => {
    it('should handle missing environment variables', async () => {
      const originalEnv = { ...process.env };
      delete process.env.ADMIN_EMAIL;
      delete process.env.ADMIN_PASSWORD_HASH;

      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const provider = authOptions.providers[0];
      if ('authorize' in provider) {
        const user = await provider.authorize?.(credentials, {});
        expect(user).toBeNull();
      }

      process.env = originalEnv;
    });

    it('should handle invalid JWT tokens', async () => {
      const mockUser: MockUser = {
        id: '1',
        email: mockEnv.ADMIN_EMAIL,
        emailVerified: null,
        role: 'admin'
      };

      const invalidToken = { 
        email: mockEnv.ADMIN_EMAIL,
        exp: Math.floor(Date.now() / 1000) - 3600 // Expired token
      } as JWT;

      const updatedToken = await authOptions.callbacks?.jwt?.({
        token: invalidToken,
        user: mockUser,
        account: null,
        trigger: 'update'
      });

      expect(updatedToken).toBeNull();
    });

    it('should handle database connection errors', async () => {
      // Simulate database error
      const mockError = new Error('Database connection failed');
      jest.spyOn(console, 'error').mockImplementation(() => {});

      const credentials = {
        email: mockEnv.ADMIN_EMAIL,
        password: 'testpassword123'
      };

      const provider = authOptions.providers[0];
      if ('authorize' in provider) {
        // @ts-expect-error Mocking internal provider behavior
        provider.adapter = {
          getUserByEmail: () => Promise.reject(mockError)
        };

        const user = await provider.authorize?.(credentials, {});
        expect(user).toBeNull();
      }
    });
  });
});