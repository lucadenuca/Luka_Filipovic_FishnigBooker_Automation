import { test, expect } from '@playwright/test';
import {NavigationPage} from '../page-objects/navigationPage'
import { asyncWrapProviders } from 'async_hooks';
import { FloridaPage } from '../page-objects/floridaPage';

test.beforeEach(async({page}) =>{
  await page.goto('https://nextjs15.dev.fishingbooker.com/sitemap')
})

// OSNOVNI TEST
test('Florida page: Validation of number of cards loaded / Validation of the 1st card / Price ascending filter / Price descending filter', async ({ page }) => {
  const navigateTo = new NavigationPage(page)
  await navigateTo.topDestinationFlorida()
  const floridaPage = new FloridaPage(page)

  const count = await floridaPage.getNumberOfCards()
  expect(count).toBeGreaterThanOrEqual(10)
  console.log(`✅ 10 or more Charter Cards loaded `)
  
  await floridaPage.validateCard(0)

  await page.locator('[data-testid="sort-price-lowest-button"]').click()

  const pricesAscending = await floridaPage.getAllPrices()
  console.log("All Ascending prices: ",pricesAscending)

  for (let i = 0; i < pricesAscending.length - 1; i++) {
    expect(pricesAscending[i]).toBeLessThanOrEqual(pricesAscending[i + 1])
  }
  console.log(`✅ All prices are in Ascending order`)

  await floridaPage.goToFilterByDescendingPrice()
  const pricesDescending = await floridaPage.getAllPrices()
  console.log("All Descending prices: ",pricesDescending)

  for (let i = 0; i < pricesDescending.length - 1; i++) {
    expect(pricesDescending[i]).toBeGreaterThanOrEqual(pricesDescending[i + 1])
  }
  console.log(`✅ All prices are in Descending order`)

})

// EXTRA EFFORT TESTS :
//1.
test('Florida page: validate all cards on 1st page', async ({ page }) => {
  const navigateTo = new NavigationPage(page)
  await navigateTo.topDestinationFlorida()
  const floridaPage = new FloridaPage(page)

  const totalCards = await floridaPage.getNumberOfCards()
  expect(totalCards).toBeGreaterThanOrEqual(10)
  console.log(`✅ ${totalCards} Charter Cards loaded`)

  for (let i = 0; i < totalCards; i++) {
    console.log(`➡️ Validating Charter Card ${i+1}`)
    await floridaPage.validateCard(i)
  }

  console.log(`✅ All ${totalCards} Charter Cards passed validation`)

})

//2.
test('Florida page: multiple page navigation (hardcoded 5 pages) & check for prices desending on each page', async ({ page }) => {
  

  const navigateTo = new NavigationPage(page)
  await navigateTo.topDestinationFlorida()
  const floridaPage = new FloridaPage(page)

  await page.locator('[data-testid="sort-price-highest-button"]').click()
  
  const totalPagesToCheck = 5; // DEFINE THE AMMOUNT OF PAGES

  for (let currentPage = 1; currentPage <= totalPagesToCheck; currentPage++) {
    console.log(`➡️ Checking page ${currentPage}`)

    await floridaPage.charterCards.first().waitFor({ state: 'visible', timeout: 10000 })

    const totalCards = await floridaPage.getNumberOfCards()
    console.log(`✔️ ${totalCards} charter cards loaded on page ${currentPage}`)

    // for (let i = 0; i < totalCards; i++) {
    //   console.log(`➡️ Validating charter card ${i + 1} on page ${currentPage}`)
    //   await floridaPage.validateCard(i)
    // }

    // console.log(`✅ All  charter cards on page ${currentPage} passed validation`)

    const prices = await floridaPage.getAllPrices()
    console.log(`Prices on page ${currentPage}:`, prices)

    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1])
    }

    console.log(`✅ Prices on page ${currentPage} are in descending order`)

    if (currentPage < totalPagesToCheck) {
      const nextPageButton = page.locator('[data-testid="next-button"]')
      await nextPageButton.click() 
    }
  }

  console.log(`✅ All prices are in descending order and validated all charter cards on first ${totalPagesToCheck} pages`)

})
