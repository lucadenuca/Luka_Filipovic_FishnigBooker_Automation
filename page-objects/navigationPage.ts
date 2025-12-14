import { Page } from "@playwright/test";


export class NavigationPage{

    readonly page: Page

    constructor(page : Page){
        this.page = page
    }

async topDestinationFlorida(){
    await this.page.getByRole('link', { name: /Florida/i }).click()
    await this.page.waitForTimeout(500)
}

}