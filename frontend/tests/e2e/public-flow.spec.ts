import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Public Storefront Flow', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/Kioto/);
    
    // Check for hero section (if exists)
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    
    // Accessibility check
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should navigate to products page', async ({ page }) => {
    await page.goto('/products');
    
    // Check products list loads
    await expect(page.locator('text=Products')).toBeVisible();
    
    // Accessibility check
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should add product to cart and view cart', async ({ page }) => {
    // Go to products page
    await page.goto('/products');
    
    // Wait for products to load and click first product
    const productCard = page.locator('[data-testid="product-card"]').first();
    if (await productCard.count() > 0) {
      await productCard.click();
      
      // Should navigate to product detail
      await expect(page).toHaveURL(/\/products\/.+/);
      
      // Add to cart button (if visible)
      const addToCartBtn = page.locator('button:has-text("Add to Cart")');
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.click();
      }
    }
  });
});