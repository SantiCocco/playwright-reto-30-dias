import { Locator, Page } from "@playwright/test";

export class QualificationsMenu {
  private readonly page: Page;
  private readonly qualifications: Locator;
  private readonly skillsOption: Locator;
  private readonly educationOption: Locator;
  private readonly licensesOption: Locator;
  private readonly languagesOption: Locator;
  private readonly membershipsOption: Locator;

  constructor(page: Page) {
    this.page = page;
    this.qualifications = page.getByRole('navigation', { name: 'Topbar menu' }).getByText('Qualifications');
    this.skillsOption = page.getByRole('menuitem', { name: 'Skills' });
    this.educationOption = page.getByRole('menuitem', { name: 'Education' });
    this.licensesOption = page.getByRole('menuitem', { name: 'Licenses' });
    this.languagesOption = page.getByRole('menuitem', { name: 'Languages' });
    this.membershipsOption = page.getByRole('menuitem', { name: 'Memberships' });
  }

  private async clickQualifications() {
    await this.qualifications.click();
  }

  async clickSkills() {
    await this.clickQualifications();
    await this.skillsOption.click();
  }

  async clickEducation() {
    await this.clickQualifications();
    await this.educationOption.click();
  }

  async clickLicenses() {
    await this.clickQualifications();
    await this.licensesOption.click();
  }

  async clickLanguages() {
    await this.clickQualifications();
    await this.languagesOption.click();
  }

  async clickMemberships() {
    await this.clickQualifications();
    await this.membershipsOption.click();
  }
}