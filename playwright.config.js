import { defineConfig } from '@playwright/test';

const baseURL =
    process.env.E2E_BASE_URL ||
    process.env.APP_URL ||
    'http://127.0.0.1:8000';

const config = defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    workers: process.env.CI ? 2 : undefined,
    timeout: 30000,
    expect: {
        timeout: 5000,
    },
    retries: process.env.CI ? 2 : 0,
    reporter: [['list']],
    use: {
        baseURL,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { browserName: 'chromium' },
        },
    ],
});

if (process.env.E2E_START_SERVER === '1') {
    config.webServer = {
        command: 'php artisan serve --host=127.0.0.1 --port=8000',
        url: 'http://127.0.0.1:8000',
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
    };
}

export default config;
