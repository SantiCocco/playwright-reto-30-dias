import { expect, Locator, Page } from "@playwright/test";
import { UserModel } from "../models/UserModel";

export class AddNewUserPage {
  readonly page: Page;
  readonly addButton: Locator;
  readonly userRoleDropdown: Locator;
  readonly statusDropdown: Locator;
  readonly employeeNameInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly saveButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = this.page.getByText('Add');
    this.userRoleDropdown = this.page.locator('div.oxd-grid-item--gutters')
      .filter({ has: this.page.getByText('User Role') })
      .locator('div.oxd-select-text-input');
    this.statusDropdown = this.page.locator('div.oxd-grid-item--gutters')
      .filter({ has: this.page.getByText('Status') })
      .locator('div.oxd-select-text-input');
    this.employeeNameInput = this.page.getByRole('textbox', { name: 'Type for hints...' });
    this.usernameInput = this.page.locator('div.oxd-grid-item--gutters')
      .filter({ has: this.page.getByText('Username') })
      .getByRole('textbox');
    this.passwordInput = this.page.locator('div.oxd-grid-item--gutters')
      .filter({ has: this.page.getByText('Password', { exact: true }) })
      .getByRole('textbox');
    this.confirmPasswordInput = this.page.locator('div.oxd-grid-item--gutters')
      .filter({ has: this.page.getByText('Confirm Password', { exact: true }) })
      .getByRole('textbox');
    this.saveButton = this.page.getByRole('button', { name: 'Save' });
    this.successMessage = this.page.locator('p.oxd-text--toast-message');
    this.errorMessage = this.page.locator('span.oxd-input-field-error-message');
  }

  async clickAddButton() {
    await this.addButton.click();
  }

  async selectUserRole(role: string) {
    await this.userRoleDropdown.click();
    await this.page.getByRole('listbox').getByText(role, { exact: true }).click();
  }

  async selectStatus(status: string) {
    await this.statusDropdown.click();
    await this.page.getByRole('listbox').getByText(status, { exact: true }).click();
  }

  async selectEmployeeName(employeeName: string) {
    await this.employeeNameInput.fill(employeeName);
    await this.page.getByText(employeeName).first().click();
  }

  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async fillConfirmPassword(confirmPassword: string) {
    await this.confirmPasswordInput.fill(confirmPassword);
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }

  async validateSuccessMessage() {
    await expect(this.successMessage).toHaveText('Successfully Saved');
  }

  async validateErrorMessage(expectedMessage: string) {
    await expect(this.errorMessage).toHaveText(expectedMessage);
  }

  async addNewUser(user: UserModel) {
    await this.clickAddButton();
    await this.selectUserRole(user.role);
    await this.selectEmployeeName(user.employeeName);
    await this.selectStatus(user.status);
    await this.fillUsername(user.username);
    await this.fillPassword(user.password);
    await this.fillConfirmPassword(user.confirmPassword);
    await this.clickSaveButton();
  }

  async getEmployeeName(): Promise<string> {
    return await this.employeeNameInput.inputValue();
  }
}