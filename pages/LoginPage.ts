import { Page, Locator, expect } from '@playwright/test';
import { UI_ROUTES } from '../constants/routes';

export class LoginPage {
    private readonly page: Page;
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('[data-test="email"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-submit"]');
    }

    //Navigates to the authentication login view.
    async navigate(): Promise<void> {
        await this.page.goto(UI_ROUTES.login); 
    }

    //Performs user login by filling in credentials and submitting the form.
    async login(email: string, pass: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(pass);
        await this.loginButton.click();
    }

    // Extracts the active authenticated bearer authorization token directly from the browser window session.
    // This method assumes that the token is stored in localStorage under the key 'auth-token' after successful login.
    async getAuthToken(): Promise<string> {
        const token = await this.page.evaluate(() => localStorage.getItem('auth-token'));
        expect(token).toBeTruthy();
        return token!;
    }
}