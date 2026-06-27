import { expect, test } from '@playwright/test'
import { LoginPage } from '../pageObjects/LoginPage'
import { SidePanel, SidePanelOptions } from '../components/sidePanel';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login OrangeHRM @login', () => {

  test('Login as admin', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.doLoginAsAdmin();

    const sidePanel = new SidePanel(page);
    await sidePanel.panelOption(SidePanelOptions.ADMIN).isVisible();
  })

  test('Login as employee', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.doLoginAsEmployee();

    const sidePanel = new SidePanel(page);
    await expect(sidePanel.panelOption(SidePanelOptions.ADMIN)).toBeHidden();
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
