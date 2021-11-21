/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src/test"],
  modulePaths: ["<rootDir>"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
  },
  moduleNameMapper: {
    "^@environment/(.*)$": "<rootDir>/environment/$1",
    "^@domain/(.*)$": "<rootDir>/src/domain/$1",
  },
  collectCoverage: true,
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
  // testResultsProcessor: "jest-sonar-reporter"
  // setupFiles: ['<rootDir>/src/test/init.ts']
};
