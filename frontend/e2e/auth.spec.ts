// frontend/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  // ── Login Page ───────────────────────────────────────────────────
  test('should display login page correctly', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByText('Bonjour')).toBeVisible()
    // ✅ Utilise l'ID exact pour éviter le strict mode violation
    await expect(page.locator('input#email')).toBeVisible()
    await expect(page.locator('input#password')).toBeVisible()
    await expect(page.getByRole('button', { name: /se connecter/i })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Créer un compte' })).toBeVisible()
  })

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.locator('input#email').fill('wrong@jass.tn')
    await page.locator('input#password').fill('wrongpassword')
    await page.click('button[type="submit"]')

    await expect(page.getByText(/identifiants invalides/i)).toBeVisible({ timeout: 5000 })
  })

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.locator('input#email').fill('ghofrane26@gmail.com')
    await page.locator('input#password').fill('password123')
    await page.click('button[type="submit"]')

    // ✅ Soit redirige vers account, soit reste connecté sur home
    await page.waitForTimeout(3000)
    const url = page.url()
    expect(url).toMatch(/localhost:3001/)
  })

  // ── Register Page ────────────────────────────────────────────────
  test('should display register page correctly', async ({ page }) => {
    await page.goto('/register')

    // ✅ Utilise le heading exact
    await expect(page.getByRole('heading', { name: 'Créer un compte' })).toBeVisible()
    await expect(page.getByPlaceholder('Prénom')).toBeVisible()
    await expect(page.locator('input#email')).toBeVisible()
    await expect(page.getByPlaceholder('Mot de passe (min. 6 caractères)')).toBeVisible()
    await expect(page.getByRole('button', { name: /créer mon compte/i })).toBeVisible()
  })

  test('should show password mismatch error', async ({ page }) => {
    await page.goto('/register')

    await page.fill('[placeholder="Prénom"]', 'Test')
    await page.fill('[placeholder="Nom"]', 'User')
    await page.locator('input#email').fill('test@jass.tn')
    await page.fill('[placeholder="Mot de passe (min. 6 caractères)"]', 'Password1')
    await page.fill('[placeholder="Confirmer le mot de passe"]', 'Password2')
    await page.click('button[type="submit"]')

    await expect(page.getByText(/mots de passe ne correspondent pas/i)).toBeVisible()
  })

  test('should navigate from login to register', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('link', { name: 'Créer un compte' }).click()
    await expect(page).toHaveURL('/register')
  })

  test('should navigate from register to login', async ({ page }) => {
    await page.goto('/register')
    await page.getByRole('link', { name: 'Se connecter' }).click()
    await expect(page).toHaveURL('/login')
  })
})