import { expect, test } from '@playwright/test'

test.describe('Claims @admin', () => {

  test('capture all amounts', async ({ page }) => {
    
    await page.goto('/web/index.php/claim/viewAssignClaim');
    const allBodyRows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row');
    await expect(allBodyRows.first()).toBeVisible();

    const amounts: number[] = [];
    const rowCount = await allBodyRows.count();
    console.log('number of rows:', rowCount);

    for (let i = 0; i < rowCount; i++) {
      const amountCell = allBodyRows.nth(i).getByRole('cell').nth(7);
      const amountText = await amountCell.textContent();
      console.log("this is the amount text: ", amountText);
    
      if (amountText === null) {
        continue
      }
      const convertedNumber = parseFloat(amountText?.replace(/,/g,'').trim())
      amounts.push(convertedNumber)
    }
    console.log('Captured amounts:', amounts);

    let total = 0
    for(let amount of amounts) {
      total += amount
    }
    
    console.log("total is: ", total)

    const average = amounts.length > 0 ? total / amounts.length : 0
    const maxAmount = amounts.length > 0 ? Math.max(...amounts) : 0
    const minAmount = amounts.length > 0 ? Math.min(...amounts) : 0

    console.log("average is: ", average)
    console.log("max amount is: ", maxAmount)
    console.log("min amount is: ", minAmount)
  })
})
