/**
 * Global Base API Environment Configuration.
 */
const BASE_URL = process.env.API_BASE_URL;

/**
 * Immutable Single Source of Truth for System API Endpoints.
 * Armed with 'as const' to enforce strict type-safe read-only structural literal constraints.
 */
export const API_ROUTES = {
    register: `${BASE_URL}/users/register`,
    createCart: `${BASE_URL}/carts`,
    invoices: `${BASE_URL}/invoices`,
    searchProducts: `${BASE_URL}/products/search`,
    postcodeLookup: `${BASE_URL}/postcode-lookup`
} as const;
// All UI Page Relative Slugs (Playwright automatically appends the Config baseURL)
export const UI_ROUTES = {
    login: '/auth/login', 
    cart: '/checkout',
} as const;