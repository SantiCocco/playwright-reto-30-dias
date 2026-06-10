import { expect, test } from '@playwright/test'

test.describe('Login OrangeHRM', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/')
  })

  test('Login to hrm @login', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin')
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123')
    await page.getByRole('button', { name: 'Login' }).click()
    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible()
  })

  test('Empty fields @login', async ({ page }) => {
    await page.getByRole('button', { name: 'Login' }).click()
    await expect(page.getByText('Required').first()).toBeVisible()
    await expect(page.getByText('Required').nth(1)).toBeVisible()
  })

  test('Invalid credentials @login', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin')
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword')
    await page.getByRole('button', { name: 'Login' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
    await expect(page.getByRole('alert')).toHaveText('Invalid credentials')
  })
})
