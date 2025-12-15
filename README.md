*Project Overview*

    This project contains Playwright end-to-end automation tests for the FishingBooker website, focusing on charter cards, price sorting, and UI element validations.

    Tests are written in TypeScript and use Playwright Test Runner.

   

*Project Structure*

    project-root/
    ├─ page-objects/       # Page object classes
    │  └─ FloridaPage.ts
    │  └─ NavigationPage.ts
    ├─ tests/              # Playwright test files
    │  └─ example.spec.ts
    ├─ .env                # Environment variables for credentials
    ├─ package.json
    ├─ playwright.config.ts
    └─ README.md

*Test that are avaliable in the project*

    There are 3 tests that I have made within this project.

    The 1st test is the requested test:
        This test navigates to the Florida Top Destination page:
            - When page is loaded it checks if there is a minimum of 10 loaded cards on the page
            - The contents of the first Charter Card is validated
                (Title of the Charter Card is not empty and is clickable,
                Price is not empty and the and the numeric value is greater than 0,
                Number of passengers text exists and the numeric value in the text is greater than 0,
                Boat length text exists and the numeric value in the text is greater than 0,
                Availability button matches the required text and is clickable,
                Whishlist tooltip is visable when hovered over by and the add to favourites button is clickable
                )
            - Selects the sort by lowest price and collects all prices from the charter cards and checks if they are in ascending order
            - Navigates to the filters and selects the filter 'Price (Highest)'
            - After the page is loaded with the applied filter the prices from the charter cards are collected and it checks if they are in desendign order
    
    The 2nd test is an extra effort test: (Extra effort test 1)
        This test does the validation of all charter cards on the Florida top destination first page
    
    The 3rd test is an extra effort test: (Extra effort test 2)
        This test check the validation of all cards on the first 5 pages of Florida top destinations and check if all the prices are in descending order on every page
    
    The 4th test is an extra effort test: (Extra effort test 3)
        This test validates all cards on the last page of Florida top destinations.


*Prerequisites*

    Before running the tests, make sure you have the following installed:

    Node.js v18+ 

    npm (comes with Node.js)

    Playwright CLI (npm install -D @playwright/test)

    Browser dependencies: npx playwright install

    Optional: Use Visual Studio Code for better TypeScript support



*Configuration and running the tests*

1. Install dependencies

    npm install
    npx playwright install

2. Make sure to be in the project directory before running the tests

    e.g. :
    cd C:\Users\Luka\OneDrive\Desktop\Luka_Filipovic_FishnigBooker_Automation

3. Run the required test of the assignemnt (The CMD comands are given with chrome browser, you can change it to firefox for FireFox, webkit for Safari)

    npx playwright test -g "Florida page: Validation of number of cards loaded" --project=chromium --headed

4. Run the extra effort test 1 

    npx playwright test -g "Florida page: validate all cards on 1st page" --project=chromium --headed

5. Run the extra effor test 2

    npx playwright test -g "Florida page: multiple page navigation" --project=chromium --headed

6. Run the exta effort test 3

    npx playwright test -g "Florida page: validate all cards on last page" --project=chromium --headed






