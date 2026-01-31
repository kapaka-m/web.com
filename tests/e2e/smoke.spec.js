// MOHAMED HASSANIN (KAPAKA)
import { expect, test } from '@playwright/test';

test.describe('public pages', () => {
    test('home renders for RTL and LTR locales', async ({ page }) => {
        await page.goto('/ar');
        await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
        await expect(page.locator('nav.navbar')).toBeVisible();

        await page.goto('/en');
        await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
        await expect(page.locator('nav.navbar')).toBeVisible();
    });

    test('contact page shows a multi-step form', async ({ page }) => {
        await page.goto('/en/contact');
        await expect(page.locator('.stepper__item')).toHaveCount(3);
        await expect(page.getByRole('button', { name: /next/i })).toBeVisible();
    });
});
