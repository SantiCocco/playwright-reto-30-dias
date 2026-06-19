import { expect, test } from "@playwright/test"
import { LoginPage } from "../pageObjects/LoginPage";

test.describe('Validate website navigation @Navigation', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.doLogin('Admin', 'admin123');
    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible()
  })

  test('Check sidebar options @Navigation1', async ({ page }) => {
    const sidebarItems = page.getByLabel('Sidepanel').getByRole('listitem')
    const currentSideBarItemsCount = await sidebarItems.count()
    console.log('Current sidebar items count', currentSideBarItemsCount)

    const currentSidebarItems: string[] = []

    for (let i = 0; i < currentSideBarItemsCount; i++) {
      const sidebarText = await sidebarItems.nth(i).innerText()
      currentSidebarItems.push(sidebarText)
    }
    console.log(currentSidebarItems)

    const expectedSidebarItems = [
      'Admin',
      'PIM',
      'Leave',
      'Time',
      'Recruitment',
      'My Info',
      'Performance',
      'Dashboard',
      'Directory',
      'Maintenance',
      'Claim',
      'Buzz']
    expect(currentSidebarItems).toEqual(expectedSidebarItems)
    expect(currentSidebarItems[0].toLowerCase()).toBe('admin')
  })

  test('Navigate through sidebar options @Navigation2', async ({ page }) => {
    const sidebarItems = page.getByLabel('Sidepanel').getByRole('listitem')
    const currentSideBarItemsCount = await sidebarItems.count()

    for (let i = 0; i < currentSideBarItemsCount; i++) {
      const sidebarItem = sidebarItems.nth(i)
      const sidebarText = await sidebarItem.innerText()

      console.log(`Navigating to ${sidebarText} page`)
      await sidebarItem.click()
      if (sidebarText.toLowerCase() === 'maintenance') {
        await page.goBack();
      }
    }
  })

  test('Check all the Job links @Navigation3', async ({ page }) => {
    const expectedPages = [
      {
        menu: 'Job Titles',
        url: '/admin/viewJobTitleList'
      },
      {
        menu: 'Pay Grades',
        url: '/admin/viewPayGrades'
      },
      {
        menu: 'Employment Status',
        url: '/admin/employmentStatus'
      },
      {
        menu: 'Job Categories',
        url: '/admin/jobCategory'
      },
      {
        menu: 'Work Shifts',
        url: '/admin/workShift'
      }
    ]

    await page.getByRole('link', { name: 'Admin' }).click()
    await page.getByRole('navigation', { name: 'Topbar menu' }).getByText('Job').click()

    const jobOptions = page.getByRole('menu').locator('li')

    for (const expectedPage of expectedPages) {
      const jobOption = jobOptions.filter({ hasText: expectedPage.menu })
      await expect(jobOption).toBeVisible()
      await jobOption.click()
      await expect(page).toHaveURL(new RegExp(expectedPage.url))
      await page.getByRole('navigation', { name: 'Topbar menu' }).getByText('Job').click()
    }
  })
})


