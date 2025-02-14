import { test, expect } from '@playwright/test';

/**
 * Blog System Tests for Oslo Languages Website.
 *
 * This test verifies that an admin can create and publish a blog post.
 * Explicit waits have been added to ensure the login form and new post page load fully.
 */
test.describe('Blog System', () => {
  test('admin can create and publish blog post', async ({ page }) => {
    // Login as admin
    await page.goto('/admin/login');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('input[name="email"]', { state: 'visible' });
    await page.waitForSelector('input[name="password"]', { state: 'visible' });

    // Use environment variables or fallback defaults for credentials
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'password';

    await page.fill('input[name="email"]', adminEmail);
    await page.fill('input[name="password"]', adminPassword);
    await page.click('button[type="submit"]');

    // Wait for navigation after login
    await page.waitForLoadState('networkidle');

    // Create a new post
    await page.goto('/admin/posts/new');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('input[name="title"]', { state: 'visible' });

    await page.fill('input[name="title"]', 'Test Post');
    await page.fill('textarea[name="excerpt"]', 'Test excerpt');
    await page.fill('textarea[name="content"]', 'Test content');

    // Publish the post
    await page.click('text=Publish');

    // Verify the post appears on the blog page
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Test Post')).toBeVisible();
  });
});
