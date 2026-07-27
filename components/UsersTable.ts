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
    const roleRows = await this.getRowsByRole(role).all();
    const firstRoleRow = roleRows[0];
    await expect(firstRoleRow, `Not ${role} user in the list`).toHaveCount(1);
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
}

