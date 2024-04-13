/** @type {import('ts-jest').JestConfigWithTsJest} */

const rootConfig = require('../../jest.config')

module.exports = {
  ...rootConfig,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
    '!src/database/**',
    '!src/utils/logger.ts'
  ],
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  setupFiles: ['<rootDir>/jest.setup.js']
}
