/** @type {import('ts-jest').JestConfigWithTsJest} */

const rootConfig = require('../../jest.config')

module.exports = {
  ...rootConfig,
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!src/index.ts',
    '!src/database/**',
    '!src/utils/logger.ts'
  ],
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.env.js']
}
