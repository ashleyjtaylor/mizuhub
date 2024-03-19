/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: '@shelf/jest-mongodb',
  moduleFileExtensions: ['tsx', 'ts', 'js'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['json', 'lcov'],
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!apps/api/src/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: -10
    }
  },
  testMatch: ['**/*/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
}
