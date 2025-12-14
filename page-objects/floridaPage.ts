import { Page, Locator } from '@playwright/test'
import {test,expect} from '@playwright/test'

export class FloridaPage {
  readonly page: Page

  readonly charterCards: Locator
  readonly charterTitle: string = '[data-testid="charter-card-title"]'            
  readonly parentCard: string = '[data-testid="charter-card-boat-silhouette"]'               
  readonly numberOfPeople: string = ':scope > p:nth-child(3) span'          
  readonly boatLength: string = ':scope > div:nth-child(2) p span'              
  readonly charterPrice: string = '[data-testid="charter-card-trip-from-container"] b'             
  readonly charterAvailability: string = '[data-testid="charter-card-see-availability-button"] span'   
  readonly addToWishlist: string = '[data-testid="add-to-wishlist"]'            

  constructor(page: Page) {
    this.page = page;
    this.charterCards = page.locator('[data-testid="single-charter-card-container"]')
    
  }

  
  card(index: number): Locator {
    return this.charterCards.nth(index)
    
  }

  
  async getTitle(index: number): Promise<string> {
    return (await this.card(index).locator(this.charterTitle).innerText()).trim()
  }

  
  async getNumberOfPeople(index: number): Promise<string> {
    const text = await this.card(index).locator(this.parentCard).locator(this.numberOfPeople).textContent()

    if (!text) throw new Error(`Number of people not found for Charter Card ${index}`)
    return text.trim()
  }

  async getNumberOfPeopleValue(index: number): Promise<number> {
    const numberOfPeopleText = await this.getNumberOfPeople(index)
    const numericValue = Number(numberOfPeopleText.replace(/[^0-9]+/g, ''))

    if (isNaN(numericValue)) {
      throw new Error(`Charter Card ${index} Unable to extract boat length from "${numberOfPeopleText}"`)
    }
    return numericValue
  }
  
  async getBoatLength(index: number): Promise<string> {
    const text = await this.card(index).locator(this.parentCard).locator(this.boatLength).textContent()

    if (!text) throw new Error(`Boat length not found for card ${index}`)
    return text.trim()
  }

  async getBoatLengthValue(index: number): Promise<number> {
    const boatLengthText = await this.getBoatLength(index)
    const numericValue = Number(boatLengthText.replace(/[^0-9]+/g, ''))

    if (isNaN(numericValue)) {
      throw new Error(`Card ${index} Unable to extract boat length from "${boatLengthText}"`)
    }
    return numericValue
}

  
  async getPriceWithValuta(index: number): Promise<string> {
    return await this.card(index).locator(this.charterPrice).innerText()
  }

  
  async getPriceValue(index: number): Promise<number> {
    const priceValue = await this.getPriceWithValuta(index)
    const numericvalue = Number(priceValue.replace(/[^0-9.]+/g, ''))
    return numericvalue
  }

  
  async getAvailabilityButtonText(index: number): Promise<string> {
    return await this.card(index).locator(this.charterAvailability).innerText()
  }

  
  async hoverWishlist(index: number) {
    const wishlist = this.card(index).locator(this.addToWishlist)
    await wishlist.scrollIntoViewIfNeeded()
    await wishlist.hover({ force: true })
  }

  
  async getWishlistTooltip(): Promise<string> {
    return await this.page.getByText('Add listing to wishlist').innerText()
  }

  
  async getNumberOfCards(): Promise<number> {
    const total = await this.charterCards.count()
    
    let visible = 0

    for (let i = 0; i < total; i++) {
      if (await this.charterCards.nth(i).isVisible()) visible++
    }

    return visible;
  }

  
  async scrollCardIntoView(index: number) {
    const card = this.card(index)
    await card.waitFor({ state: 'attached', timeout: 15000 })
    await card.scrollIntoViewIfNeeded()
    await card.waitFor({ state: 'visible', timeout: 5000 })
  }

  
  async getAllPrices(): Promise<number[]> {
    
    const prices: number[] = []
    let previousCount = -1

    while (true) {
      const total = await this.charterCards.count()
      if (total === previousCount) break
      previousCount = total

      for (let i = prices.length; i < total; i++) {
        const card = this.card(i)

        if (await card.isVisible()) {
          const priceLocator = card.locator(this.charterPrice).first()
          await priceLocator.waitFor({ state: 'visible', timeout: 5000 })

          const priceText = await priceLocator.innerText();
          const priceValue = Number(priceText.replace(/[^0-9.]+/g, ''))
          prices.push(priceValue)

          console.log(`Charter Card ${i+1} price:`, priceValue)
        }
      }

      await this.page.evaluate(() => window.scrollBy(0, window.innerHeight))
      await this.page.waitForTimeout(500)
    }

    return prices
  }

  async selectFromFilterDropdownPriceHighestg() {
    
    }

  async validateCard(index: number) {
    await this.scrollCardIntoView(index)

    // Title
    const title = await this.getTitle(index)
    if (!title) throw new Error(`Charter Card ${index} title is empty`)
    try {
      await this.card(index).locator(this.charterTitle).click({ trial: true })
    } catch {
      throw new Error(`Charter Card ${index} title is not clickable`)
    }

    // Number of people
    const numberOfPeopleText = await this.getNumberOfPeople(index)
    const numberOfPeopleValue = await this.getNumberOfPeopleValue(index)
    if (!/^Up to \d+ people$/.test(numberOfPeopleText)) {
      throw new Error(`Charter Card ${index} number of people text invalid: "${numberOfPeopleText}"`)
    }
    if (numberOfPeopleValue <=   0) {
      throw new Error(`Charter Card ${index} number of people value invalid: ${numberOfPeopleValue}`)
    }

    // Boat length
    const boatLengthText = await this.getBoatLength(index)
    const boatLengthValue = await this.getBoatLengthValue(index)
    if (!/^\d+ ft$/.test(boatLengthText)) {
      throw new Error(`Charter Card ${index} boat length text invalid: "${boatLengthText}"`)
    }
    if (boatLengthValue <= 0) {
      throw new Error(`Charter Card ${index} boat length value invalid: ${boatLengthValue}`)
    }

    // Price
    const priceText = await this.getPriceWithValuta(index)
    const priceValue = await this.getPriceValue(index)
    if (!priceText) throw new Error(`Charter Card ${index} price text is empty`)
    if (priceValue <= 0) throw new Error(`Charter Card ${index} price value invalid: ${priceValue}`)

    // Availability button
    const availabilityText = await this.getAvailabilityButtonText(index)
    if (availabilityText !== "See availability") {
      throw new Error(`Charter Card ${index} availability button text invalid: "${availabilityText}"`)
    }

    try {
      await this.card(index).locator(this.charterTitle).click({ trial: true })
    } catch {
      throw new Error(`Charter Card ${index} availability button is not clickable`)
    }

    // Wishlist
    await this.hoverWishlist(index);
    const wishlistTooltip = await this.getWishlistTooltip();
    if (wishlistTooltip !== "Add listing to wishlist") {
      throw new Error(`Charter Card ${index} wishlist tooltip invalid: "${wishlistTooltip}"`)
    }

    try {
      await this.card(index).locator(this.charterTitle).click({ trial: true })
    } catch {
      throw new Error(`Charter Card ${index} wishlist button is not clickable`)
    }

    console.log(`✅ Charter Card ${index+1} -> All validations passed`)
    
  }

  async goToFilterByDescendingPrice() {
    await this.page.getByText('Sort by Price (Lowest)').click()
    await this.page.getByText('Price (Highest)').click()
    await this.page.locator('button', { hasText: 'Apply' }).click()
    await this.page.locator('[data-testid="single-charter-card-container"]').first().waitFor({ state: 'visible', timeout: 10000 })
  }

}

