import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
import * as fs from 'fs';
dotenv.config({ path: path.resolve(__dirname, '.env') });

const allureResultsDir = path.resolve(__dirname, 'allure-results');
if (!fs.existsSync(allureResultsDir)) {
  fs.mkdirSync(allureResultsDir, { recursive: true });
}

const envProperties = `
Platform=${process.platform}
Node.js_Version=${process.version}
ENV=${process.env.TEST_ENV || 'Production'}
Base_URL=${process.env.BASE_URL || 'https://restful-booker.herokuapp.com'}
`;

fs.writeFileSync(path.join(allureResultsDir, 'environment.properties'), envProperties.trim());

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['line'],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },


  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'api-database-tests',
      dependencies: ['setup'],
      testIgnore: /.*\.setup\.ts/, 
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'cd restful-booker && npm start',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
