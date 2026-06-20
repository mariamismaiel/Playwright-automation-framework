import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_ROUTES } from '../constants/routes';
import { PaymentMethodAPIType } from '../constants/paymentMethods';
import { AddressLookupResult } from './PostcodeLookupApi';

export class InvoiceApi {
    private request: APIRequestContext;
    private token: string;
    private headers: Record<string, string>;

    constructor(request: APIRequestContext, token: string) {
        this.request = request;
        this.token = token;
        this.headers = {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        };
    }

    // Sends a POST request to generate an invoice based on the completed checkout data
    async createInvoice(apiAddressData: AddressLookupResult, cartId: string, paymentMethodApi: PaymentMethodAPIType): Promise<APIResponse> {
        // Construct the backend payload mapping from the API address lookup and session cart ID
        const payload = {
            billing_street: apiAddressData.street,
            billing_city: apiAddressData.city,
            billing_state: apiAddressData.state,
            billing_country: apiAddressData.country,
            billing_postal_code: apiAddressData.postcode,
            payment_method: paymentMethodApi,
            payment_details: {},
            cart_id: cartId
        };

        return await this.request.post(API_ROUTES.invoices, {
            headers: this.headers,
            data: payload
        });
    }
}