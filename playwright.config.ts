import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:65186',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'mobile-chromium',
      use: {
        ...devices['iPhone 13'],
      },
    },
  ],
})
