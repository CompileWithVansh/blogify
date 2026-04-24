const { test, expect } = require('@playwright/test');

/**
 * CRUD E2E Tests
 *
 * Unauthenticated tests run without any setup.
 * Authenticated tests require saving auth state first:
 *
 *   npx playwright codegen http://localhost:3000 --save-storage=e2e/auth.json
 *   Sign in manually, then close the browser.
 *   Uncomment the storageState lines below.
 */

test.describe('Auth Protection (unauthenticated)', () => {
  test('create post page redirects to sign-in', async ({ page }) => {
    await page.goto('/blog/create');
    // Should redirect to Clerk sign-in
    await expect(page).toHaveURL(/sign-in|clerk/i);
  });

  test('dashboard page redirects to sign-in', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/sign-in|clerk/i);
  });

  test('edit post page redirects to sign-in', async ({ page }) => {
    await page.goto('/blog/edit/1');
    await expect(page).toHaveURL(/sign-in|clerk/i);
  });
});

test.describe('Post Form Validation', () => {
  // These tests use the public blog page — no auth needed
  test('blog listing page loads without error', async ({ page }) => {
    const response = await page.goto('/blog');
    expect(response?.status()).toBeLessThan(500);
  });

  test('home page loads without error', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBeLessThan(500);
  });
});

// ── Authenticated CRUD (uncomment after saving auth state) ────────────────────
//
// test.describe('Authenticated CRUD', () => {
//   test.use({ storageState: 'e2e/auth.json' });
//
//   test('can access create post page', async ({ page }) => {
//     await page.goto('/blog/create');
//     await expect(page.getByTestId('post-form')).toBeVisible();
//   });
//
//   test('create post form has required fields', async ({ page }) => {
//     await page.goto('/blog/create');
//     await expect(page.getByTestId('title-input')).toBeVisible();
//     await expect(page.getByTestId('content-input')).toBeVisible();
//     await expect(page.getByTestId('submit-btn')).toBeVisible();
//   });
//
//   test('dashboard shows user posts', async ({ page }) => {
//     await page.goto('/dashboard');
//     await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible();
//   });
//
//   test('can create a post and see it in dashboard', async ({ page }) => {
//     await page.goto('/blog/create');
//     await page.getByTestId('title-input').fill('E2E Test Post ' + Date.now());
//     await page.getByTestId('content-input').fill('This is automated test content.');
//     await page.getByTestId('submit-btn').click();
//     await expect(page).toHaveURL(/dashboard/);
//   });
// });
