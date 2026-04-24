const { test, expect } = require('@playwright/test');

test.describe('Home Page', () => {
  test('loads and shows hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Blogify/i);
    await expect(page.getByTestId('hero-read-btn')).toBeVisible();
    await expect(page.getByTestId('hero-write-btn')).toBeVisible();
  });

  test('navbar logo is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('nav-logo')).toBeVisible();
  });

  test('clicking Start Reading navigates to /blog', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('hero-read-btn').click();
    await expect(page).toHaveURL(/\/blog/);
  });

  test('hero has a heading', async ({ page }) => {
    await page.goto('/');
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('is responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.getByTestId('nav-logo')).toBeVisible();
    // Mobile menu button should be visible
    await expect(page.locator('button[aria-label="Toggle menu"]')).toBeVisible();
  });

  test('footer is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toBeVisible();
  });
});
