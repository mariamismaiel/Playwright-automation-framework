/**
 * Centralized Single Source of Truth for Application Payment Methods.
 * Maps the exact visible UI labels to their corresponding backend API payload string keys.
 * Armed with 'as const' to guarantee strict, immutable, read-only literal types.
 */
export const PAYMENT_METHODS = {
    BANK_TRANSFER: {
        ui: 'Bank Transfer',
        api: 'bank-transfer'
    },
    CASH_ON_DELIVERY: {
        ui: 'Cash on Delivery',
        api: 'cash-on-delivery'
    },
    CREDIT_CARD: {
        ui: 'Credit Card',
        api: 'credit-card'
    },
    BUY_NOW_PAY_LATER: {
        ui: 'Buy Now Pay Later',
        api: 'buy-now-pay-later'
    },
    GIFT_CARD: {
        ui: 'Gift Card',
        api: 'gift-card'
    }
} as const;

/**
 * Enforces compile-time type checking for frontend-visible payment text values.
 * Restricts input strictly to values rendered in the UI dropdown selection fields.
 */
export type PaymentMethodUIType = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS]['ui'];

/**
 * Enforces compile-time type checking for backend-accepted payment slug keys.
 * Restricts API payload structures to exact contracts accepted by the transactional billing services.
 */
export type PaymentMethodAPIType = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS]['api'];