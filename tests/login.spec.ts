import { expect, test } from '@playwright/test'
import { LoginPage } from '../pageObjects/LoginPage'

test.describe('Login OrangeHRM @login', () => {

  test('Login to hrm', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.doLogin('Admin', 'admin123');
    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible()
  })

  test('Empty fields', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.doLogin('', '');
    await expect(page.getByText('Required').first()).toBeVisible()
    await expect(page.getByText('Required').nth(1)).toBeVisible()
  })

  test('Invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.doLogin('Admin', 'wrongpassword');
    await expect(page.getByRole('alert')).toBeVisible()
    await expect(page.getByRole('alert')).toHaveText('Invalid credentials')
  })
})
