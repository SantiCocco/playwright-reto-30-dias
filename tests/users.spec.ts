import { expect, test } from "@playwright/test"

test.describe('Manage users as admin @UserManagement', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/')
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin')
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123')
    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible()
    await page.getByRole('link', { name: 'Admin' }).click()
    await page.getByRole('navigation', { name: 'Topbar menu' }).getByText('User Management').click()
    await page.getByRole('menuitem', { name: 'Users' }).click()
  })

  test('Get all the usernames registered', async ({ page }) => {
    const rows = page.getByRole('table').getByRole('row')
    const usernames: string[] = []
    const rowCount = await rows.count()

    for (let i = 1; i < rowCount; i++) {
      const UsernameCell = rows.nth(i).getByRole('cell').nth(1)
      const username = await UsernameCell.textContent()
      if (username) {
        usernames.push(username)
      }
    }
    console.log(usernames)
  })

  test('Get all the Employee names registered', async ({ page }) => {
    const rows = page.getByRole('table').getByRole('row')
    const employeeNames: string[] = []
    const rowCount = await rows.count()

    for (let i = 1; i < rowCount; i++) {
      const EmployeeNameCell = rows.nth(i).getByRole('cell').nth(3)
      const employeeName = await EmployeeNameCell.textContent()
      if (employeeName) {
        employeeNames.push(employeeName)
      }
    }
    console.log(employeeNames)
  })
})

