import { Page } from '@playwright/test';
import { SidePanel, SidePanelOptions } from '../components/SidePanel';
import { TopBarMenu } from '../components/top-bar-menu/TopBarMenu';

export class Navigate {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async toDashboard() {
    await this.page.goto('/web/index.php/dashboard/index');
  }

  async toUsers() {
        await this.toDashboard();
        const sidePanel = new SidePanel(this.page);
        const topBarMenu = new TopBarMenu(this.page);
        await sidePanel.clickOnOption(SidePanelOptions.ADMIN);
        await topBarMenu.userManagement.clickUsers();
  }
}