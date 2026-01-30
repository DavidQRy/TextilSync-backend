// vitest.config.js
import { coverageConfigDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: './test/setup.test.ts',
    include: ['**/*.test.ts', '**/*.spec.ts'],
    exclude: [ 'node_modules', 'dist' ],
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{js,ts}'],
      exclude: [
        '*.config.*',
        '**/index.ts',
        '**/index.js',
        'src/app.ts',
        'src/app.js',
        'src/models/**',
        'src/dtos/**',
        'src/routes/**',
        'src/config/**',
        'src/types/**',
        'src/generated/**',
        ...coverageConfigDefaults.exclude,
      ]
    },
  },
})
