/** @type {import('jest').Config} */
const config = {
  // 1. Environment and Setup
  // Use 'node' for backend testing
  testEnvironment: 'node',

  // Jest will look for files matching these patterns
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],

  // Directories/files to ignore from test collection
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/' // Ignore built code
  ],

  // 2. Code Coverage Configuration
  collectCoverage: true, // Enable coverage collection
  coverageDirectory: 'coverage', // Where to output coverage reports

  // Specify which files to include in the coverage report
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts', // Exclude type definitions
    '!src/index.js', // Exclude main entry file (usually just bootstraps)
    '!src/config/**' // Exclude configuration files
  ],

  // 3. Setup Files
  // Run this file(s) before all tests in the suite
  // This is crucial for setting up things like:
  // - Environment variables (e.g., setting a specific test database URL)
  // - Database mock/setup (if you use mocks)
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js' // We will create this file next
  ],

  // 4. Transform/Module Handling
  // If you use ES Modules (import/export), uncomment the lines below
  // to ensure Jest can properly handle them by mapping files to Babel/TS.
  // moduleNameMapper: {},
  // transform: {}
};

export default config;