/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the experimental.serverActions flag as it's now default
  experimental: {
    // Other experimental features can stay
  },
  // Optionally disable SendGrid API validation during development
  env: {
    SENDGRID_VALIDATION_DISABLED: process.env.NODE_ENV === 'development' ? 'true' : 'false',
  },
  eslint: {
    // Use the new ESLint configuration
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;