import { Page, Locator, expect } from '@playwright/test';
import { PaymentMethodUIType } from '../constants/paymentMethods';

interface AddressApiData {
    street: string;
    city: string;
    state: string;
    postal_code?: string;
}

export class CheckoutPage {
    private readonly page: Page;
    private readonly cartIcon: Locator;
    private readonly proceedToSignInButton: Locator;
    private readonly proceedToBillingAddressButton: Locator;
    private readonly proceedToPaymentButton: Locator;
    private readonly countrySelect: Locator;
    private readonly postalCodeInput: Locator;
    private readonly houseNumberInput: Locator;
    private readonly streetInput: Locator;
    private readonly cityInput: Locator;
    private readonly stateInput: Locator;
    private readonly paymentMethodDropdown: Locator;
    private readonly confirmOrderBtn: Locator;
    private readonly addressLookupSpinner: Locator;
    private readonly successMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.proceedToSignInButton = page.locator('[data-test="proceed-1"]');
        this.proceedToBillingAddressButton = page.locator('[data-test="proceed-2"]');
        this.proceedToPaymentButton = page.locator('[data-test="proceed-3"]');
        this.countrySelect = page.locator('[data-test="country"]');
        this.postalCodeInput = page.locator('[data-test="postal_code"]');
        this.houseNumberInput = page.locator('[data-test="house_number"]');
        this.streetInput = page.locator('[data-test="street"]');
        this.cityInput = page.locator('[data-test="city"]');
        this.stateInput = page.locator('[data-test="state"]');
        this.cartIcon = page.locator('[data-test="nav-cart"]');
        this.paymentMethodDropdown = page.locator('[data-test="payment-method"]');
        this.confirmOrderBtn = page.locator('[data-test="finish"]');
        this.addressLookupSpinner = page.locator('[data-test="postcode-lookup-loading"]');
        this.successMessage = page.getByText('Payment was successful');
    }

    // Clicks on the cart icon to open the shopping cart page
    async navigateToCart(): Promise<void> {
        await this.cartIcon.click();
    }

    // Clicks the button to move from the cart to the sign-in step
    async proceedToSignIn(): Promise<void> {
        await this.proceedToSignInButton.click();
    }

    // Clicks the button to move from sign-in to the address step
    async proceedToBillingAddress(): Promise<void> {
        await this.proceedToBillingAddressButton.click();
    }

    // Clicks the button to move from the address step to the payment step
    async proceedToPayment(): Promise<void> {
        await this.proceedToPaymentButton.click();
    }

    // Fills the house number and waits for the automated address lookup spinner to disappear
    async fillBillingAddressDetails(houseNumber: string): Promise<void> {
        await expect(this.postalCodeInput).not.toHaveValue('', { timeout: 3000 });
        await this.houseNumberInput.pressSequentially(houseNumber);
        await expect(this.addressLookupSpinner).toBeHidden({ timeout: 5000 });
    }

    // Checks that the address text fields in the UI match the expected API data
    async verifyUIAddressMatchesAPI(apiData: AddressApiData): Promise<void> {
        await expect(this.streetInput).toHaveValue(apiData.street);
        await expect(this.cityInput).toHaveValue(apiData.city);
        await expect(this.stateInput).toHaveValue(apiData.state);
    }

    // Selects the preferred payment method from the dropdown option
    async selectPaymentMethod(method: PaymentMethodUIType): Promise<void> {
        await this.paymentMethodDropdown.selectOption(method);
    }

    // Clicks the final order confirmation button to complete the purchase
    async confirmOrder(): Promise<void> {
        await this.confirmOrderBtn.click();
    }
     // The application requires two confirmation actions:
    // first confirms payment, second triggers invoice generation.
    async triggerInvoiceCreation(): Promise<void> {
        await this.confirmOrder();
        await this.verifyPaymentSuccessMessage();
        await this.confirmOrder();
    }

    // Saves cart data directly into browser sessionStorage and reloads the page to update the UI
    async injectCartSessionAndReload(cartId: string, quantity: number): Promise<void> {
        await this.page.evaluate(({ id, quantity }) => {
            window.sessionStorage.setItem('cart_id', id);
            window.sessionStorage.setItem('cart_quantity', String(quantity));
        }, { id: cartId, quantity: quantity });

        await this.page.reload();
        await this.page.waitForLoadState('networkidle');
    }

    // Asserts that the payment success confirmation message is visible on screen
    async verifyPaymentSuccessMessage(): Promise<void> {
        await expect(this.successMessage).toBeVisible({ timeout: 5000 });
    }
}