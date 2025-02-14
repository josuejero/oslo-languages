import { test, expect } from '@playwright/test';

/**
 * Basic Navigation Tests for Oslo Languages Website.
 *
 * These tests cover the navigation between Home, Courses, About, and Contact pages.
 * Explicit waits have been added to ensure pages and elements are fully loaded
 * before assertions and actions are performed.
 */
test.describe('Basic Navigation', () => {
  test('should navigate through main pages', async ({ page }) => {
    // Home page
    await page.goto('/');
    // Wait for all network requests to finish
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Oslo Languages/);

    // Navigate to Courses
    await page.click('text=Courses');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*courses/);
    await expect(page.locator('h1')).toContainText('Our Language Courses');

    // Navigate to About
    await page.click('text=About');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*about/);
    await expect(page.locator('h1')).toContainText('About Oslo Languages');

    // Navigate to Contact
    await page.click('text=Contact');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*contact/);
    await expect(page.locator('h1')).toContainText('Contact Us');
  });

  test('contact form submission', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');

    // Ensure form fields are visible before filling them
    await page.waitForSelector('input[name="name"]', { state: 'visible' });
    await page.waitForSelector('input[name="email"]', { state: 'visible' });
    await page.waitForSelector('input[name="subject"]', { state: 'visible' });
    await page.waitForSelector('textarea[name="message"]', { state: 'visible' });

    // Fill out the contact form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="subject"]', 'Test Subject');
    await page.fill('textarea[name="message"]', 'Test Message');

    // Submit the form
    await page.click('button[type="submit"]');

    // Check for the success message
    await expect(page.locator('text=Thank you for your message')).toBeVisible();
  });
});
