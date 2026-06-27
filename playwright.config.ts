import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

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
  workers: 2,
  expect: {
    // Sube el tiempo de espera por defecto de los expects individuales a 10s
    timeout: 10000, 
  },
  // Sube el timeout global de cada test a 45 o 60 segundos
  timeout: 45000,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',
    baseURL: 'https://opensource-demo.orangehrmlive.com/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    launchOptions: {
      slowMo: 500
    }
  },

  /* Configure projects for roles */
  projects: [
    {
      name: 'setupEmployee',
      testMatch: /.*\.setupEmployee\.ts/,
    },
    {
      name: 'setupAdmin',
      testMatch: /.*\.setupAdmin\.ts/,
    },
    {
      name: 'admin',
      dependencies: ['setupAdmin'],
      grep: /@admin/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/admin.json'
      },
    },
    {
      name: 'employee',
      dependencies: ['setupEmployee'],
      grep: /@employee/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/employee.json'
      },
    },
    {
      name: 'login',
      grep: /@login/,
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
