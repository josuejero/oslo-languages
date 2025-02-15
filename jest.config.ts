// jest.config.ts
import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  testEnvironment: 'jsdom', 
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: [
    '/node_modules/(?!(lucide-react|just-performance|limiter))',
    "/node_modules/(?!(remark|unified|remark-parse|remark-html)/)",
    "/node_modules/(?!remark-parse|remark-html|unified)/",
    "/node_modules/(?!(remark|unified|rehype)/)",
    '/node_modules/(?!(remark|unified|bail|is-plain-obj|trough|vfile)/)'
    

  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  testMatch: [
    '**/__tests__/**/*.ts?(x)',
    '**/?(*.)+(spec|test).ts?(x)'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/types.ts',
    '!src/middleware.ts',
    '!src/**/generated/**',
  ],
  testTimeout: 20000,
  verbose: true,
  bail: true,
  maxWorkers: 1,
};

export default createJestConfig(config);