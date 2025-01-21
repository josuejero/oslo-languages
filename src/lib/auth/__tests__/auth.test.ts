// src/lib/auth/__tests__/auth.test.ts
import { describe, it, expect } from '@jest/globals';
import { authOptions } from '../config';
import { hash } from 'bcryptjs';

describe('Authentication', () => {
  it('validates admin credentials correctly', async () => {
    const credentials = {
      email: process.env.ADMIN_EMAIL,
      password: 'test-password'
    };

    const hashedPassword = await hash(credentials.password, 12);
    process.env.ADMIN_PASSWORD_HASH = hashedPassword;

    const provider = authOptions.providers[0] as any;
    const authorize = provider.authorize;
    if (!authorize) throw new Error('Authorize function not found');

    const user = await authorize(credentials, {});
    expect(user).toBeTruthy();
    expect(user?.email).toBe(credentials.email);
  });
});