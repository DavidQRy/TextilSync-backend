// vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: './test/setupTest.js',
    include: ['**/*.test.js', '**/*.spec.js'],
  },
})
