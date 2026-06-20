import { test as base } from '@playwright/test';
import { RegisterUsersApi } from '../apis/RegisterUsersApi';
import { SearchProductsApi } from '../apis/SearchProductsApi';
import { CartApi } from '../apis/CartApi';
import { InvoiceApi } from '../apis/InvoiceApi';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PostcodeLookupApi } from '../apis/PostcodeLookupApi';

/**
 * Define the custom fixtures types available for injection within tests.
 * Includes both Page Object Models (POM) and API Client instances.
 */
type MyFixtures = {
    userClient: RegisterUsersApi;
    loginPage: LoginPage;
    homePage: HomePage;
    checkoutPage: CheckoutPage;
    productsClient: SearchProductsApi;
    postcodeLookupClient: PostcodeLookupApi;
    cartClient: (token: string) => CartApi; 
    invoiceClient: (token: string) => InvoiceApi;
};

/**
 * Extend Playwright's base test block to inject custom Page Objects and API clients.
 * This eliminates manual instantiation inside test scripts, ensuring high separation of concerns.
 */
export const test = base.extend<MyFixtures>({
    userClient: async ({ request }, use) => {
        await use(new RegisterUsersApi(request));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    productsClient: async ({ request }, use) => {
        await use(new SearchProductsApi(request));
    },
    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },
    cartClient: async ({ request }, use) => {
        await use((token: string) => new CartApi(request, token));
    },
    invoiceClient: async ({ request }, use) => {
        await use((token: string) => new InvoiceApi(request, token));
    },
    postcodeLookupClient: async ({ request }, use) => {
        await use(new PostcodeLookupApi(request));
    },
});

export { expect } from '@playwright/test';