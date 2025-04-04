/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static rendering for the contact page
  experimental: {
    serverActions: true,
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