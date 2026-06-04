import type { Config } from 'jest';

const config: Config = {
  // Use jsdom to simulate a browser environment
  testEnvironment: 'jsdom',

  // Setup files run after the test framework is installed
  setupFilesAfterFramework: ['<rootDir>/src/setupTests.ts'],

  // Transform TypeScript and JSX using ts-jest
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },

  // Module name mapper: resolve path aliases and static assets
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg|ico|webp|ttf|woff|woff2)$':
      '<rootDir>/src/__mocks__/fileMock.ts',
  },

  // Match test files
  testMatch: [
    '<rootDir>/src/**/*.test.{ts,tsx}',
    '<rootDir>/src/**/*.spec.{ts,tsx}',
  ],

  // Ignore build output, node_modules, and e2e tests
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/e2e/'],

  // Collect coverage from source files (excluding boilerplate)
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/main.tsx',
    '!src/app/router.tsx',
    '!src/__mocks__/**',
    '!src/setupTests.ts',
  ],

  // Enforce minimum coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  coverageReporters: ['text', 'lcov', 'html'],

  // Show individual test results
  verbose: true,
};

export default config;
