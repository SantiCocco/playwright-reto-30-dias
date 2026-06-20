import { Locator, Page } from '@playwright/test';

export class SidePanel {

  readonly page: Page;
  readonly searchInput: Locator;
  readonly sidePanelItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByRole('textbox', { name: 'Search' });
    this.sidePanelItems = page.getByLabel('Sidepanel').getByRole('listitem')
  }

  public panelOption(option: SidePanelOptions) {
    return this.page.getByRole('link', { name: option });
  }

  async clickOnOption(option: SidePanelOptions) {
    await this.panelOption(option).click();
  }

  async doSearch(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
  }

}

export enum SidePanelOptions {
  ADMIN = 'Admin',
  PIM = 'PIM',
  LEAVE = 'Leave',
  TIME = 'Time',
  RECRUITMENT = 'Recruitment',
  MY_INFO = 'My Info',
  PERFORMANCE = 'Performance',
  DASHBOARD = 'Dashboard',
  DIRECTORY = 'Directory',
  MAINTENANCE = 'Maintenance',
  CLAIM = 'Claim',
  BUZZ = 'Buzz'
}