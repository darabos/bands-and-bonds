import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5174',
    trace: 'on',
  },
  timeout: 600_000,
  expect: { timeout: 10_000 },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev -- --host 0.0.0.0 --port 5174',
    url: 'http://localhost:5174',
    reuseExistingServer: true,
  },
});
