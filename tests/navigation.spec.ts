import { expect, test } from "@playwright/test"

test.describe('Validate sidebar items @Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/')
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin')
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123')
    await page.getByRole('button', { name: 'Login' }).click()
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
})


