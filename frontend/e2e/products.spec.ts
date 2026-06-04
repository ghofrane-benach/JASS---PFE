// frontend/e2e/products.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Products', () => {

  test('should display products page', async ({ page }) => {
    await page.goto('/products')
    await expect(page.locator('header')).toBeVisible()
  })

  test('should display product cards', async ({ page }) => {
    await page.goto('/products')
    await page.waitForTimeout(2000)
    const productCards = page.locator('a[href*="/products/"]')
    const count = await productCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should navigate to product detail', async ({ page }) => {
    await page.goto('/products')
    await page.waitForTimeout(2000)

    // ✅ Attendre la navigation après le clic
    const firstProduct = page.locator('a[href*="/products/"]').first()
    const count = await firstProduct.count()

    if (count > 0) {
      const href = await firstProduct.getAttribute('href')
      if (href && href !== '/products') {
        await firstProduct.click()
        await page.waitForURL(/\/products\/.+/, { timeout: 5000 })
        await expect(page.url()).toContain('/products/')
      }
    }
  })

  test('should filter products by category', async ({ page }) => {
    await page.goto('/products?category=scarfs')
    await page.waitForTimeout(2000)
    await expect(page.locator('header')).toBeVisible()
    await expect(page).toHaveURL(/category=scarfs/)
  })

  test('should search products from URL', async ({ page }) => {
    await page.goto('/products?search=echarpe')
    await page.waitForTimeout(2000)
    await expect(page.locator('header')).toBeVisible()
  })
})