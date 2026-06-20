import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
    private readonly page: Page;
    private readonly userMenuDropdown: Locator;

    constructor(page: Page) {
        this.page = page;
        this.userMenuDropdown = page.locator('[data-test="nav-menu"]');
    }

     // Web-first assertion to validate that the target user session is active and successfully logged in.
    async verifyUserIsLoggedIn(expectedText: string): Promise<void> {
        await expect(this.userMenuDropdown).toHaveText(new RegExp(expectedText));
    }
}