import {test as setup} from '@playwright/test';
import {LoginPage} from '../pageObjects/LoginPage';

setup('authentication as employee', async ({ page }) => {
  console.log('Starting employee authentication setup...');
  const loginPage = new LoginPage(page);
  await loginPage.doLoginAsEmployee();

  await page.context().storageState({ path: '.auth/employee.json' });

  console.log('Employee authentication setup completed successfully.');
});