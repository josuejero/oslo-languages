// e2e/blog-system.test.ts
import { test, expect } from '@playwright/test';

test.describe('Blog System', () => {
  test('admin can create and publish blog post', async ({ page }) => {
    // Login as admin
    await page.goto('/admin/login');
    await page.fill('input[name="email"]', process.env.ADMIN_EMAIL || '');
    await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD || '');
    await page.click('button[type="submit"]');
    
    // Create new post
    await page.goto('/admin/posts/new');
    await page.fill('input[name="title"]', 'Test Post');
    await page.fill('textarea[name="excerpt"]', 'Test excerpt');
    await page.fill('textarea[name="content"]', 'Test content');
    
    // Publish post
    await page.click('text=Publish');
    
    // Verify post is published
    await page.goto('/blog');
    await expect(page.locator('text=Test Post')).toBeVisible();
  });
});