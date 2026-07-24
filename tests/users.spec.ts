import { expect, test } from "@playwright/test"
import { SidePanel, SidePanelOptions } from "../components/sidePanel";
import { TopBarMenu } from "../components/top-bar-menu/TopBarMenu";
import { Navigate } from "../pageObjects/Navigate";
import { AddNewUserPage } from "../pageObjects/AddNewUserPage";
import { UserModel } from "../models/UserModel";
import { UserFactory } from "../factory/UserFactory";



test.describe('Manage users as admin @UserManagement @admin', () => {
  test.beforeEach(async ({ page }) => {
    const navigate = new Navigate(page);
    await navigate.toDashboard();
    const sidePanel = new SidePanel(page);
    const topBarMenu = new TopBarMenu(page);
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
    const rows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row');
    await expect(rows.first()).toBeVisible();

    const rowCount = await rows.count()
    const users: {
      username: string;
      rowIndex: number;
    }[] = [];

    for (let i = 0; i < rowCount; i++) {
      const userNameCell = rows.nth(i).getByRole('cell').nth(1)
      const username = (await userNameCell.textContent())?.trim()
      if (username && username !== 'Admin') {
        users.push({
          username: username,
          rowIndex: i
        })
      }
    }

    expect(users, 'No editable users found in the users table').not.toHaveLength(0);

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

  test('check user status options @UserManagement5', async ({ page }) => {
    const expectedStatusOptions = ['-- Select --', 'Enabled', 'Disabled']
    await page.locator("//label[contains(.,'Status')]/parent::div/following-sibling::div").click()
    const currentUserStatusOptions = await page.getByRole('listbox').getByRole('option').allInnerTexts()
    await expect(currentUserStatusOptions, "User status options do not match expected values").toEqual(expectedStatusOptions)
  })

  test('filter by user admin @UserManagement6', async ({ page }) => {
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

  test('filter by user admin V2 @UserManagement7', async ({ page }) => {
  const tableBody = page.getByRole('table').getByRole('rowgroup').nth(1);
  const allBodyRows = tableBody.getByRole('row');

  // 1. Contamos cuántas filas tienen 'Admin' ANTES de aplicar el filtro
  const expectedAdminCount = await allBodyRows.filter({ hasText: 'Admin' }).count();
  console.log(`Admin users expected after filtering: ${expectedAdminCount}`);

  // 2. Aplicar filtro por role 'Admin'
  await page.locator("//label[contains(.,'User Role')]/parent::div/following-sibling::div").click();
  await page.getByRole('listbox').getByRole('option', { name: 'Admin' }).click();
  await page.getByRole('button', { name: 'Search' }).click();

  // 3. Validamos que la cantidad de filas tras el filtro coincida con lo esperado
  await expect(allBodyRows).toHaveCount(expectedAdminCount);

  // 4. Validamos que la tercera columna (User Role) de todas las filas resultantes sea 'Admin'
  const expectedLabels = Array(expectedAdminCount).fill('Admin');
  const roleCellsColumn = allBodyRows.locator('[role="cell"]:nth-child(3)'); // Selecciona la 3ª celda de cada fila
  
  await expect(roleCellsColumn).toHaveText(expectedLabels);
  });

  test('Add new user admin', async ({ page }) => {

    const allBodyRows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row')
    // Filas que contienen role 'Admin'
    const currentAdminRows = allBodyRows.filter({
      has: page.getByRole('cell').nth(2).getByText('Admin')
    })
    const firstAdminRow = currentAdminRows.nth(0)
    await expect(firstAdminRow,"Not admin user in the list").toHaveCount(1)
    await firstAdminRow.locator('button')
      .filter({ has: page.locator('i.bi-pencil-fill') }).click();

    const fullUserToSearch = await page.getByRole('textbox', { name: 'Type for hints...' }).inputValue();
    console.log(`Employee name to search: ${fullUserToSearch}`)

    const adminUser = UserFactory.createAdmin({
      employeeName: fullUserToSearch
    });

    await page.goBack();
    const addNewUserPage = new AddNewUserPage(page);
    await addNewUserPage.addNewUser(adminUser);
    await addNewUserPage.validateSuccessMessage();
  })

  test('Add new user ESS', async ({ page }) => {

    const allBodyRows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row')
    // Filas que contienen role 'ESS'
    const currentESSRows = allBodyRows.filter({
      has: page.getByRole('cell').nth(2).getByText('ESS')
    })
    const firstESSRow = currentESSRows.nth(0)
    await expect(firstESSRow,"Not ESS user in the list").toHaveCount(1)
    await firstESSRow.locator('button')
      .filter({ has: page.locator('i.bi-pencil-fill') }).click();

    const fullUserToSearch = await page.getByRole('textbox', { name: 'Type for hints...' }).inputValue();
    console.log(`Employee name to search: ${fullUserToSearch}`)

    const essUser = UserFactory.createEmployeeESS({
      employeeName: fullUserToSearch
    });

    await page.goBack();
    const addNewUserPage = new AddNewUserPage(page);
    await addNewUserPage.addNewUser(essUser);
    await addNewUserPage.validateSuccessMessage();
  })

  test('Validate user creation errors', async ({ page }) => {
    const newUser = UserFactory.createEmployeeESS(
      {
        confirmPassword: 'Password456!'
      }
    );

    const addNewUserPage = new AddNewUserPage(page);
    await addNewUserPage.addNewUser(newUser);
    await addNewUserPage.validateErrorMessage('Passwords do not match');
  })
});
