import {test as setup, expect} from '@playwright/test';
import {LoginPage} from '../pageObjects/LoginPage';

setup('authentication as admin', async ({ page }) => {
  console.log('Starting admin authentication setup...');
  const loginPage = new LoginPage(page);
  await loginPage.doLoginAsAdmin();
  
  await expect(page.getByRole('link', {name: 'Admin'})).toBeVisible();

  await page.context().storageState({ path: '.auth/admin.json' });

  console.log('Admin authentication setup completed successfully.');
});