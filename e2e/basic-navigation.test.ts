import { test, expect } from '@playwright/test';

test.describe('Basic Navigation', () => {
  test('should navigate through main pages', async ({ page }) => {
    // Home page
    await page.goto('/');
    await expect(page).toHaveTitle(/Oslo Languages/);
    
    // Navigate to Courses
    await page.click('text=Courses');
    await expect(page).toHaveURL(/.*courses/);
    await expect(page.locator('h1')).toContainText('Our Language Courses');
    
    // Navigate to About
    await page.click('text=About');
    await expect(page).toHaveURL(/.*about/);
    await expect(page.locator('h1')).toContainText('About Oslo Languages');
    
    // Navigate to Contact
    await page.click('text=Contact');
    await expect(page).toHaveURL(/.*contact/);
    await expect(page.locator('h1')).toContainText('Contact Us');
  });

  test('contact form submission', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill out the form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="subject"]', 'Test Subject');
    await page.fill('textarea[name="message"]', 'Test Message');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Check for success message
    await expect(page.locator('text=Thank you for your message')).toBeVisible();
  });
});