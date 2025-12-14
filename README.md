*Project Overview*

    This project contains Playwright end-to-end automation tests for the FishingBooker website, focusing on charter cards, price sorting, and UI element validations.

    Tests are written in TypeScript and use Playwright Test Runner.

*Prerequisites*

    Before running the tests, make sure you have the following installed:

    Node.js v18+ 

    npm (comes with Node.js)

    Playwright CLI (npm install -D @playwright/test)

    Browser dependencies: npx playwright install

    Optional: Use Visual Studio Code for better TypeScript support.

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

*Configuration*

1. Install dependencies
    npm install
    npx playwright install

2. Run all tests
    npx playwright test

3. Run a single test file
    npx playwright test tests/example.spec.ts

4. Run in headed mode (see browser)
    npx playwright test --headed

5. Run with a specific browser
    npx playwright test --project=chromium

6. Generate HTML report
    npx playwright show-report




