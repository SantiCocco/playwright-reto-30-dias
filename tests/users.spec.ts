import { expect, test } from "@playwright/test"
import { LoginPage } from "../pageObjects/LoginPage"


test.describe('Manage users as admin @UserManagement', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.doLoginAsAdmin();

    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible()
    await page.getByRole('link', { name: 'Admin' }).click()
    await page.getByRole('navigation', { name: 'Topbar menu' }).getByText('User Management').click()
    await page.getByRole('menuitem', { name: 'Users' }).click()
  })

  test('Get all the usernames registered @UserManagement1', async ({ page }) => {
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

  test('Get all the Employee names registered @UserManagement2', async ({ page }) => {
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

  test('Select random user for edition @UserManagement3', async ({ page }) => {
    const rows = page.getByRole('table').getByRole('row');
    const rowCount = await rows.count()
    const users: {
      username: string;
      rowIndex: number;
    }[] = [];

    for (let i = 1; i < rowCount; i++) {
      const userNameCell = rows.nth(i).getByRole('cell').nth(1)
      const username = await userNameCell.textContent()
      if (username && username !== 'Admin') {
        users.push({
          username: username,
          rowIndex: i
        })
      }
    }

    const randomUser = users[Math.floor(Math.random() * users.length)];
    const selectedRow = rows.nth(randomUser.rowIndex);
    const pencilEditButton = selectedRow.locator('button')
      .filter({ has: page.locator('i.bi-pencil-fill') });

    await pencilEditButton.click()

    await expect(page.locator("//label[contains(.,'Username')]/parent::div/following-sibling::div/input"))
      .toHaveValue(randomUser.username)
  })
})

