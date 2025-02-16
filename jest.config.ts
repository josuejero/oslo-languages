// jest.config.ts
import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: [
    '/node_modules/(?!(remark-html)/)',
    '/node_modules/(?!(remark-html|@mdx-js|unified|bail|is-plain-obj|trough|vfile|unist-util-stringify-position|micromark-util-decode-numeric-character-reference|micromark-util-decode-string|micromark-util-normalize-identifier|decode-named-character-reference)/)',

  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    'remark-html': '<rootDir>/src/__mocks__/remark.ts'
  },
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
      '^.+\\.(js|jsx)$': 'babel-jest',
      '^.+\\.(ts|tsx)$': ['ts-jest', {
        tsconfig: 'tsconfig.json',
        isolatedModules: true,
      }],
  },
  testPathIgnorePatterns: ['/node_modules/','/e2e/'],
  testMatch: [
    "**/src/**/*.(test|spec).{ts,tsx}",
    '**/__tests__/**/*.test.[jt]s?(x)',

  ],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      diagnostics: false,
    },
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

};

export default createJestConfig(config);
