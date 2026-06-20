import { test, expect } from '../fixtures/fixture';
import { DataGeneratorHelper } from '../utils/DataGeneratorHelper';
import userDataRaw from '../test-data/userData.json';
import productsDataRaw from '../test-data/productsData.json';
import { PAYMENT_METHODS } from '../constants/paymentMethods';
import { AddressLookupResult } from '../apis/PostcodeLookupApi';
import { API_ROUTES } from '../constants/routes';

test('End-to-End User Journey Scenario: Register to Invoice Validation', async ({
    page,
    userClient,
    productsClient,
    postcodeLookupClient,
    loginPage,
    homePage,
    checkoutPage,
    cartClient,
    invoiceClient
}) => {

    let completeUserData = { ...userDataRaw, email: '' };
    let authToken: string = '';
    let cartId: string = '';
    let productID: string = '';
    let apiAddressData: AddressLookupResult;
    let invoiceNumber: string = '';
    const houseNumber: string = '22';

    await test.step('1. Create user via API with random email', async () => {
        const randomEmail = DataGeneratorHelper.generateRandomEmail();
        completeUserData.email = randomEmail;
        const response = await userClient.registerUser(completeUserData);
        expect(response.status()).toBe(201);

        expect(await response.json()).toMatchObject({
            email: completeUserData.email,
            first_name: completeUserData.first_name,
            last_name: completeUserData.last_name,
            address: completeUserData.address
        });
    });

    await test.step('2. Log in via UI and extract Auth Token', async () => {
        await loginPage.navigate();
        await loginPage.login(completeUserData.email, completeUserData.password);

        await homePage.verifyUserIsLoggedIn(`${completeUserData.first_name} ${completeUserData.last_name}`);

        authToken = await loginPage.getAuthToken();
    });

    await test.step('3. Fetch Product ID dynamically via Search API', async () => {
        productID = await productsClient.getFirstProductIdByName(productsDataRaw.productName);
    });

    await test.step('4. Create Cart and Add Product via API', async () => {
        const createCartRes = await cartClient(authToken).createCart();
        expect(createCartRes.status()).toBe(201);
        const cartData = await createCartRes.json();
        cartId = cartData.id;

        const addToCartRes = await cartClient(authToken).addToCart(cartId, productID, productsDataRaw.quantity);
        expect(addToCartRes.status()).toBe(200);

        // Required because the application UI reads cart_id and cart_quantity from sessionStorage.
        // API cart creation alone does not sync the frontend cart state.
        await checkoutPage.injectCartSessionAndReload(cartId, productsDataRaw.quantity);
    });

    await test.step('5. Complete Checkout via UI with Cash on Delivery', async () => {
        await checkoutPage.navigateToCart();
        await checkoutPage.proceedToSignIn();
        await checkoutPage.proceedToBillingAddress();
        await checkoutPage.fillBillingAddressDetails(houseNumber);

        // Validate that the address fields populated by the automated postcode lookup match the expected API data
        const lookupRes = await postcodeLookupClient.getAddressDetails(
            completeUserData.address.country,
            completeUserData.address.postal_code,
            houseNumber
        );
        expect(lookupRes.status()).toBe(200);
        apiAddressData = await lookupRes.json();
        await checkoutPage.verifyUIAddressMatchesAPI(apiAddressData);
        await checkoutPage.proceedToPayment();
        await checkoutPage.selectPaymentMethod(PAYMENT_METHODS.CASH_ON_DELIVERY.ui);

    });
    await test.step('6. Validate Invoice Creation API Response', async () => {
        // Set up a network listener to catch the backend POST request for invoice creation before triggering the action
        const invoiceResponsePromise = page.waitForResponse(
            response => response.url().includes(API_ROUTES.invoices) && response.request().method() === 'POST',
            { timeout: 15000 }
        );

        await checkoutPage.triggerInvoiceCreation();

        // Wait for the asynchronous network response to resolve and extract the backend payload directly
        const invoiceResponse = await invoiceResponsePromise;
        expect(invoiceResponse.status()).toBe(201);
        const invoiceResponseData = await invoiceResponse.json();

        expect(String(invoiceResponseData.invoice_number)).toMatch(/^INV-/);
        expect(invoiceResponseData.id).toBeDefined();

        invoiceNumber = invoiceResponseData.invoice_number;
    });

    // Alternative approach: Creating the invoice directly via backend API if required

    // await test.step('6. Create Invoice via API and Validate Business Rules', async () => {
    //     // Trigger invoice generation via API client using active cart and lookup address data
    //     const createInvoiceRes = await invoiceClient(authToken).createInvoice(
    //         apiAddressData,
    //         cartId,
    //         PAYMENT_METHODS.CASH_ON_DELIVERY.api
    //     );

    //     expect(createInvoiceRes.status()).toBe(201);
    //     const invoiceResponseData = await createInvoiceRes.json();

    //     expect(String(invoiceResponseData.invoice_number)).toMatch(/^INV-/);
    //     expect(invoiceResponseData.id).toBeDefined();

    //     invoiceNumber = invoiceResponseData.invoice_number;
    // });

    // Pushes dynamic runtime execution parameters straight into the HTML report dashboard overview
    test.info().annotations.push(
        { type: 'Test Generated Email', description: completeUserData.email },
        { type: 'Dynamic Target Product ID', description: productID },
        { type: 'Active Session Cart ID', description: cartId },
        { type: 'Generated Invoice Number', description: invoiceNumber }
    );
});