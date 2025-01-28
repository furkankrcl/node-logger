/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  coverageDirectory: "coverage",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  coverageProvider: "v8",
  testMatch: ["**/*.test.ts"],
  testPathIgnorePatterns: ["src/examples"],
  coveragePathIgnorePatterns: ["src/examples"],
};

export default config;
