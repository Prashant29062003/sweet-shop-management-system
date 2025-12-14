export default {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.js"],
  testMatch: ["**/?(*.)+(test|spec).js"],
  clearMocks: true,

  transform: {},
  moduleFileExtensions: ['js', 'json', 'node'],
  testTimeout: 30000,
};
