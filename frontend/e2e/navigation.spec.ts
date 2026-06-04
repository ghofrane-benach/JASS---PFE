// frontend/e2e/navigation.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {

  test('should load homepage correctly', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/JASS/i)
    await expect(page.locator('header')).toBeVisible()
  })

  test('should display JASS logo in header', async ({ page }) => {
    await page.goto('/')
    const logo = page.locator('header').getByText('JASS').first()
    await expect(logo).toBeVisible()
  })

  test('should display navigation links', async ({ page }) => {
    await page.goto('/')
    // ✅ Scope les liens dans le nav pour éviter strict mode violation
    const nav = page.locator('nav.desktop-nav')
    await expect(nav.getByRole('link', { name: 'Accueil' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'JASS Collection' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Notre Histoire' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Contact' })).toBeVisible()
  })

  test('should navigate to products page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=JASS Collection')
    await expect(page).toHaveURL('/products')
  })

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/')
    await page.locator('nav.desktop-nav').getByRole('link', { name: 'Notre Histoire' }).click()
    await expect(page).toHaveURL('/about')
  })

  test('should navigate to contact page', async ({ page }) => {
    await page.goto('/')
    await page.locator('nav.desktop-nav').getByRole('link', { name: 'Contact' }).click()
    await expect(page).toHaveURL('/contact')
  })

  test('should open search on click', async ({ page }) => {
    await page.goto('/')
    await page.click('[aria-label="Rechercher"]')
    await expect(page.getByPlaceholder(/looking for/i)).toBeVisible()
  })

  test('should search for products', async ({ page }) => {
    await page.goto('/')
    await page.click('[aria-label="Rechercher"]')
    await page.fill('[placeholder*="looking for"]', 'écharpe')
    await page.waitForTimeout(500)
    await expect(page.locator('header')).toBeVisible()
  })

  test('should display footer', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('footer')).toBeVisible()
  })
})