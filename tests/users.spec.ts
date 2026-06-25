import { expect, test } from "@playwright/test"
import { LoginPage } from "../pageObjects/LoginPage"
import { SidePanel, SidePanelOptions } from "../components/sidePanel";
import { TopBarMenu } from "../components/top-bar-menu/TopBarMenu";



test.describe('Manage users as admin @UserManagement', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sidePanel = new SidePanel(page);
    const topBarMenu = new TopBarMenu(page);
    await loginPage.doLoginAsAdmin();
    await sidePanel.clickOnOption(SidePanelOptions.ADMIN);
    await topBarMenu.userManagement.clickUsers();
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

  test('check user role options @UserManagement4', async ({ page }) => {
    const expectedRoleOptions = ['-- Select --', 'Admin', 'ESS']
    await page.locator("//label[contains(.,'User Role')]/parent::div/following-sibling::div").click()
    const currentUserRoleOptions = await page.getByRole('listbox').getByRole('option').allInnerTexts()
    await expect(currentUserRoleOptions, "User role options do not match expected values").toEqual(expectedRoleOptions)
  })

  test('check user status options @UserManagement4', async ({ page }) => {
    const expectedStatusOptions = ['-- Select --', 'Enabled', 'Disabled']
    await page.locator("//label[contains(.,'Status')]/parent::div/following-sibling::div").click()
    const currentUserStatusOptions = await page.getByRole('listbox').getByRole('option').allInnerTexts()
    await expect(currentUserStatusOptions, "User status options do not match expected values").toEqual(expectedStatusOptions)
  })

  test('filter by user admin', async ({ page }) => {
    const allBodyRows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row')
    // Filas que contienen role 'Admin'
    const currentAdminRows = allBodyRows.filter({
      has: page.getByRole('cell').nth(2).getByText('Admin')
    })
    const expectedAdminCount = await currentAdminRows.count()
    console.log(`Admin users before filtering: ${expectedAdminCount}`)
    // Aplicar filtro por role 'Admin'
    await page.locator("//label[contains(.,'User Role')]/parent::div/following-sibling::div").click()
    await page.getByRole('listbox').getByRole('option', { name: 'Admin' }).click()
    await page.getByRole('button', { name: 'Search' }).click()
    // La tabla filtrada debe contener la misma cantidad de filas que la tabla original
    await expect(allBodyRows).toHaveCount(expectedAdminCount)

    for (let i = 0; i < expectedAdminCount; i++) {
      const roleCell = allBodyRows.nth(i).getByRole('cell').nth(2)
      await expect(roleCell).toHaveText('Admin')
    }
  })

  test('filter by user admin V2', async ({ page }) => {
    const tableBody = page.getByRole('table').getByRole('rowgroup').nth(1);
    const allBodyRows = tableBody.getByRole('row');
    const roleCells = allBodyRows.getByRole('cell').nth(2);
    // Contamos cuantas filas Admin hay antes de filtrar
    const expectedAdminCount = await allBodyRows.filter({ hasText: 'Admin' }).count();
    console.log(`Admin users before filtering: ${expectedAdminCount}`);
    // Extraemos los textos de la columna 3 de TODAS las filas reales presentes
    const rowsCount = await allBodyRows.count();
    const actualLabels: string[] = [];
    for (let i = 0; i < rowsCount; i++) {
      const cellText = await allBodyRows.nth(i).getByRole('cell').nth(2).innerText();
      actualLabels.push(cellText);
    }
    // Aplicar filtro por role 'Admin'
    await page.locator("//label[contains(.,'User Role')]/parent::div/following-sibling::div").click();
    await page.getByRole('listbox').getByRole('option', { name: 'Admin' }).click();
    await page.getByRole('button', { name: 'Search' }).click();
    // Validamos que la cantidad de filas coincida
    await expect(allBodyRows).toHaveCount(expectedAdminCount);
    // Creamos un array con la cantidad de filas esperadas, todas con el texto 'Admin' y comparamos
    const expectedLabels = Array(expectedAdminCount).fill('Admin');
    console.log(`Actual labels in table:`, actualLabels);
    console.log(`Expected labels in table:`, expectedLabels);
    await expect(roleCells).toHaveText(expectedLabels);
  })

})

