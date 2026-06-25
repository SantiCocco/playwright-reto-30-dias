import { Locator, Page } from "@playwright/test";

export class UserManagementMenu {
  private readonly page: Page;
  private readonly userManagement: Locator;
  private readonly usersOption: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userManagement = page.getByRole('navigation', { name: 'Topbar menu' }).getByText('User Management');
    this.usersOption = page.getByRole('menuitem', { name: 'Users' });
  }

  private async clickUserManagement() {
    await this.userManagement.click();
  }

  async clickUsers() {
    await this.clickUserManagement();
    await this.usersOption.click();
  }
}