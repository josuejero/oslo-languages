// src/lib/auth/__tests__/config.test.ts

import { authOptions } from '../config';
import bcrypt from 'bcryptjs';
import { type CredentialsConfig } from 'next-auth/providers/credentials';
import type { Session, Account } from 'next-auth';
import type { JWT } from 'next-auth/jwt'; // Correct type-only import
import type { AdapterUser } from 'next-auth/adapters'; // Correct type-only import

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
    jest.resetModules();
  });

  describe('Credentials Provider', () => {
    it('should validate correct credentials', async () => {
      const credentials = {
        email: mockEnv.ADMIN_EMAIL,
        password: 'testpassword123'
      };

      const provider = authOptions.providers[0] as CredentialsConfig;
      expect(provider.authorize).toBeDefined();
      const user = await provider.authorize!(credentials, {});
      
      expect(user).toBeTruthy();
      if (user) {
        expect(user.email).toBe(credentials.email);
        expect((user as AdapterUser & { role: string }).role).toBe('admin');
      }
    });

    it('should reject incorrect password', async () => {
      const credentials = {
        email: mockEnv.ADMIN_EMAIL,
        password: 'wrongpassword'
      };

      const provider = authOptions.providers[0] as CredentialsConfig;
      const user = await provider.authorize!(credentials, {});
      expect(user).toBeNull();
    });

    it('should reject incorrect email', async () => {
      const credentials = {
        email: 'wrong@example.com',
        password: 'testpassword123'
      };

      const provider = authOptions.providers[0] as CredentialsConfig;
      const user = await provider.authorize!(credentials, {});
      expect(user).toBeNull();
    });

    it('should enforce rate limiting', async () => {
      const credentials = {
        email: mockEnv.ADMIN_EMAIL,
        password: 'wrongpassword'
      };

      const provider = authOptions.providers[0] as CredentialsConfig;

      // Make multiple failed attempts
      for (let i = 0; i < 5; i++) {
        await provider.authorize!(credentials, {});
      }

      // Next attempt should throw rate limit error
      await expect(provider.authorize!(credentials, {}))
        .rejects
        .toThrow('Too many login attempts');
    });

    it('should reset rate limit after window expires', async () => {
      jest.useFakeTimers();

      const credentials = {
        email: mockEnv.ADMIN_EMAIL,
        password: 'wrongpassword'
      };

      const provider = authOptions.providers[0] as CredentialsConfig;

      // Make multiple failed attempts
      for (let i = 0; i < 5; i++) {
        await provider.authorize!(credentials, {});
      }

      // Advance time beyond rate limit window
      jest.advanceTimersByTime(15 * 60 * 1000); // 15 minutes

      // Should be able to attempt again
      const attempt = provider.authorize!(credentials, {});
      await expect(attempt).resolves.not.toThrow();

      jest.useRealTimers();
    });
  });

  describe('JWT Configuration', () => {
    const mockCallbacks = authOptions.callbacks!;

    it('should add role to JWT token', async () => {
      const token = { email: mockEnv.ADMIN_EMAIL } as JWT;
      const mockUser: AdapterUser & { role: string } = {
        id: '1',
        email: mockEnv.ADMIN_EMAIL,
        role: 'admin',
        emailVerified: null
      };

      const mockAccount: Account = {
        provider: 'credentials',
        type: 'credentials',
        providerAccountId: '1'
      };

      const newToken = await mockCallbacks.jwt?.({
        token,
        user: mockUser,
        account: mockAccount,
        profile: undefined,
        trigger: 'signIn'
      });

      expect(newToken).toHaveProperty('role', 'admin');
    });

    it('should add role to session', async () => {
      const mockUser: AdapterUser & { role: string } = {
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

      const newSession = await mockCallbacks.session?.({
        session: mockSession,
        token: mockToken,
        user: mockUser,
        trigger: 'update',
        newSession: null
      });

      expect(newSession?.user).toBeDefined();
      expect(newSession?.user).toHaveProperty('role', 'admin');
    });
  });

  describe('Pages Configuration', () => {
    const pages = authOptions.pages!;

    it('should use custom sign-in page', () => {
      expect(pages.signIn).toBe('/admin/login');
    });

    it('should use custom error page', () => {
      expect(pages.error).toBe('/admin/login');
    });
  });

  describe('Session Configuration', () => {
    const session = authOptions.session!;

    it('should use JWT strategy', () => {
      expect(session.strategy).toBe('jwt');
    });

    it('should set appropriate session maxAge', () => {
      // Should be 2 hours
      expect(session.maxAge).toBe(2 * 60 * 60);
    });
  });
});
