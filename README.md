# Playwright Automation Framework

## Overview
This repository contains a Playwright-based hybrid test automation framework for end-to-end web testing. It implements a scalable Hybrid API/UI automation approach to optimize test execution time while validating critical business workflows.

## Project Structure
- `apis/` - API helper classes for backend interactions and service calls.
- `constants/` - Reusable constant values such as route definitions and payment methods.
- `fixtures/` - Test fixtures and shared setup logic.
- `pages/` - Page object models for application pages.
- `tests/` - Playwright test specs.
- `test-data/` - Test data files used by the tests.
- `utils/` - Utility helper modules.
- `playwright.config.ts` - Playwright configuration file, including browser projects and base URL settings.
- `.env` - Environment variables used by the test configuration.
- `package.json` - Project dependencies.

---

## Test Automation Scenario & Coverage
The suite executes a complete **End-to-End User Journey** (`tests/e2eCheckout.spec.ts`) using a hybrid optimization layer:
1. **API:** Registers a new user with dynamically generated data and validates profile payload response.
2. **UI:** Automatically logs in via web form and extracts session tokens.
3. **API:** Dynamically resolves product catalog identifiers via search endpoints.
4. **API & UI:** Creates a backend cart session, injects products, and bypasses UI steps by injecting state into browser session storage.
5. **UI:** Completes the multi-step checkout wizard, utilizing an independent postcode API lookup to cross-validate dynamic address injection before confirming the order via Cash on Delivery.
6. **API:** Generates the final order invoice and executes regex business pattern matching on the generated invoice number (`^INV-`).

---
## Architecture & Playwright Best Practices Implemented
This framework is fully built upon the official [Playwright Best Practices Documentation](https://playwright.dev/docs/best-practices) and resilient testing guidelines.
* **Adherence to User-Visible Behavior Philosophy:** Tests focus strictly on verifying the application from the end-user's perspective. Element interactions prioritize resilient, user-facing semantic configurations rather than fragile CSS classes or structural DOM hooks.
* **Strict Adoption of Web-First Assertions:** All UI verifications explicitly leverage asynchronous web-first assertions (e.g., `await expect().toBeVisible()`). This natively utilizes Playwright's auto-waiting and retry-ability mechanism, completely eliminating flaky manual boolean checks.
* **Isolated State Hooking & Mocking Strategy:** The project implements strict test isolation principles. It utilizes custom test fixtures and an optimized hybrid optimization layer to programmatically inject backend-generated cart states straight into browser session storage, avoiding messy end-to-end repetition.
* **Multi-Browser & Type-Safe Architecture:** Designed natively using TypeScript for structural safety and early compile-time error detection. The environment is configured with cross-browser execution projects (Chromium, Firefox, WebKit) out of the box.
---
## Prerequisites
- Node.js installed (v18 or higher recommended).
- npm available from your terminal.

## Clone the Repository

```bash
git clone https://github.com/mariamismaiel/Playwright-automation-framework.git
cd Playwright-automation-framework
```

## Install Dependencies
From the repository root, run:
```bash
npm install
```

If you do not already have Playwright browsers installed, run:

```bash
npx playwright install
```

## Configure Environment Variables
The repository utilizes a .env file for runtime configuration. The base target application environment is set to:

BASE_URL=https://practicesoftwaretesting.com

## To Run Tests Locally
Execute all tests across all configured browser projects concurrently:
```bash
npx playwright test
```
## To run the single E2E scenario target file:
```bash
npx playwright test tests/e2eCheckout.spec.ts
```
## Run tests in different browsers

The test suite is configured with browser projects in `playwright.config.ts`.

Run all browsers:

```bash
npx playwright test
```

Run only Chromium:

```bash
npx playwright test --project=chromium
```

Run only Firefox:

```bash
npx playwright test --project=firefox
```

Run WebKit if enabled in `playwright.config.ts`:

```bash
npx playwright test --project=webkit
```

## Test reporting

The configuration generates an HTML report. After a test run, open the report with:

```bash
npx playwright show-report
```
## Additional Enhancements

- Dynamic email generation to guarantee test data uniqueness.
- Product ID resolution via Search API instead of hard-coded identifiers.
- Postcode API validation against checkout UI address fields.
- Runtime execution metadata attached to Playwright HTML reports.
- Invoice creation response validation through network interception.

## Notes

- Use `npx playwright test --help` for additional CLI options and advanced filtering.
