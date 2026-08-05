import { expect, Locator, Page } from "@playwright/test";

export class UsersTable {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }

  getAllBodyRows():Locator {
    return this.page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row');
  }

  getRowsByRole(role: string): Locator {
    const allBodyRows = this.getAllBodyRows();
    const currentRows = allBodyRows.filter({
      has: this.page.getByRole('cell').nth(2).getByText(role)
    });
    return currentRows;
  }

  private async getFirstRoleFromTable(role: string): Promise<Locator> {
    const firstRoleRow = this.getRowsByRole(role).first();
    await expect(firstRoleRow, `No ${role} user in the list`).toBeVisible();
    return firstRoleRow;
  }

  async editFirstRole(role: string) {
    const firstRoleRow = await this.getFirstRoleFromTable(role);
    await firstRoleRow.locator('button')
      .filter({ has: this.page.locator('i.bi-pencil-fill') }).click();
  }

  applyFilterByRole(role: string) {
    this.page.locator("//label[contains(.,'User Role')]/parent::div/following-sibling::div").click();
    this.page.getByRole('listbox').getByRole('option', { name: role }).click();
    this.page.getByRole('button', { name: 'Search' }).click();
  }

  async validateAllUsersHaveRole(role: string, expectedCount: number) {
    const allBodyRows = this.getAllBodyRows();
    for (let i = 0; i < expectedCount; i++) {
      const roleCell = allBodyRows.nth(i).getByRole('cell').nth(2)
      await expect(roleCell).toHaveText(role)
    }
  }

  async validateAllUserNotPresent(username: string) {
    const allBodyRows = this.getAllBodyRows();
    const rowCount = await allBodyRows.count();
    for (let i = 0; i < rowCount; i++) {
      const usernameCell = allBodyRows.nth(i).getByRole('cell').nth(1);
      await expect(usernameCell).not.toHaveText(username);
    }
  }

  async validateUserIsPresent(username: string) {
    const allBodyRows = this.getAllBodyRows();
    const userRow = allBodyRows.filter({
      has: this.page.getByRole('cell').nth(1).getByText(username, { exact: true })
    });
    await expect(userRow.first(), `User with username ${username} not found`).toBeVisible();
  }

  async clickDeleteByUserName(username: string) {
    const allBodyRows = this.getAllBodyRows();
    const userRow = allBodyRows.filter({
      has: this.page.getByRole('cell').nth(1).getByText(username)
    });
    await expect(userRow, `User with username ${username} not found`).toHaveCount(1);
    const deleteButton = userRow.locator('button').filter({ has: this.page.locator('i.bi-trash') });
    await deleteButton.click();
  }

  async acceptDeleteUser() {
    await this.page.getByRole('button', { name: /Yes, Delete/ }).click();
  }

  async cancelDeleteUser() {
    await this.page.getByRole('button', { name: /No, Cancel/ }).click();
  }
}
