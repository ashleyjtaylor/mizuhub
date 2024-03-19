/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['tsx', 'ts', 'js'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['json', 'lcov'],
  collectCoverageFrom: ['**/*.{ts,tsx}'],
  testMatch: ['**/*/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
}
