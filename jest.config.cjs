// jest.config.cjs

// Import Next.js Jest wrapper.
// This allows Jest to load Next.js configuration, paths, env vars, and webpack settings.
const nextJest = require("next/jest");

// Create a Jest config that extends Next.js defaults.
// "dir" should point to the root of your Next.js application.
const createJestConfig = nextJest({
  dir: "./",
});

/**
 * @type {import('jest').Config}
 * Custom Jest configuration for a Next.js + TypeScript project.
 */
const customJestConfig = {
  // Use jsdom to simulate a browser-like environment for testing React components.
  testEnvironment: "jest-environment-jsdom",

  // Load additional setup (such as extending `expect()` with jest-dom matchers).
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Allow importing paths like "@/components/Button" instead of long relative paths.
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // Mocks
    "next-intl": "<rootDir>/__mocks__/next-intl.js",
    "next/image": "<rootDir>/__mocks__/next-image.js",
    "^next/navigation$": "<rootDir>/__mocks__/next-navigation.js",
  },

  // Tell Jest not to ignore some ESM packages that need transpiling.
  // Here we explicitly allow the "uuid" module.
  transformIgnorePatterns: ["/node_modules/(?!(uuid|next-intl)/)"],
};

// Export final config by merging Next.js config + custom config.
module.exports = createJestConfig(customJestConfig);
