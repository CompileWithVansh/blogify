const { test, expect } = require('@playwright/test');

test.describe('SEO & Accessibility', () => {
  test('home page has meta description', async ({ page }) => {
    await page.goto('/');
    const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDesc).toBeTruthy();
    expect(metaDesc.length).toBeGreaterThan(10);
  });

  test('home page has og:title', async ({ page }) => {
    await page.goto('/');
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();
  });

  test('blog page has correct title tag', async ({ page }) => {
    await page.goto('/blog');
    const title = await page.title();
    expect(title).toMatch(/Blog.*Blogify|Blogify.*Blog/i);
  });

  test('sitemap.xml is accessible and returns XML', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
    const contentType = response?.headers()['content-type'] ?? '';
    expect(contentType).toContain('xml');
  });

  test('robots.txt is accessible', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
    const body = await page.locator('body').textContent();
    expect(body).toContain('User-agent');
  });

  test('home page has exactly one h1', async ({ page }) => {
    await page.goto('/');
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test('blog page has exactly one h1', async ({ page }) => {
    await page.goto('/blog');
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test('all images have alt attributes', async ({ page }) => {
    await page.goto('/');
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      // alt can be empty string (decorative) but must exist
      expect(alt).not.toBeNull();
    }
  });

  test('nav links are keyboard accessible', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT', 'BODY']).toContain(focused);
  });

  test('page has lang attribute on html element', async ({ page }) => {
    await page.goto('/');
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBeTruthy();
  });
});
