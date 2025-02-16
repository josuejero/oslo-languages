// src/pages/api/__mocks__/next-auth.ts
const mockSession = {
  user: { email: process.env.ADMIN_EMAIL || 'admin@example.com' }
};

const NextAuth = jest.fn(() => ({
  getSession: jest.fn(() => Promise.resolve(mockSession))
}));

export default NextAuth;