const { test, expect } = require('@playwright/test');

test.describe('Blog Listing Page', () => {
  test('loads blog page with correct title', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'networkidle' });
    await expect(page).toHaveTitle(/Blog/i);
    await expect(page.getByRole('heading', { name: /The Blog/i })).toBeVisible();
  });

  test('search bar is visible and interactive', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'networkidle' });
    const searchInput = page.getByTestId('search-input');
    await expect(searchInput).toBeEnabled();
    await searchInput.fill('test');
    await expect(searchInput).toHaveValue('test');
  });

  test('category filter is visible', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'networkidle' });
    await expect(page.getByTestId('category-filter')).toBeVisible();
  });

  test('search updates URL params on submit', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'networkidle' });
    const searchInput = page.getByTestId('search-input');
    await expect(searchInput).toBeEnabled();
    await searchInput.fill('nextjs');
    await page.getByTestId('search-form').press('Enter');
    await expect(page).toHaveURL(/search=nextjs/);
  });

  test('category filter updates URL params', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'networkidle' });
    const filter = page.getByTestId('category-filter');
    await expect(filter).toBeEnabled();
    await filter.selectOption('technology');
    await expect(page).toHaveURL(/category=technology/);
  });

  test('blog page has article count text', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'networkidle' });
    // Either shows "X articles published" or "No articles yet"
    const body = await page.locator('body').textContent();
    const hasCount = body.includes('article') || body.includes('No articles');
    expect(hasCount).toBeTruthy();
  });
});

test.describe('Blog Post Page', () => {
  test('navigating to a non-existent post shows 404', async ({ page }) => {
    await page.goto('/blog/this-post-does-not-exist-xyz-abc-123', { waitUntil: 'domcontentloaded' });
    const title = await page.title();
    const body = await page.locator('body').textContent();
    const is404 = title.includes('404') || title.includes('Not Found') || body.includes('404') || body.includes('not found');
    expect(is404).toBeTruthy();
  });
});
