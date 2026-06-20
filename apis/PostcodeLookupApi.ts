import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_ROUTES } from '../constants/routes';

// Defining a strict shape interface for the address record data returned by this service
export interface AddressLookupResult {
    street: string;
    city: string;
    state: string;
    country: string;
    postcode: string;
}

export class PostcodeLookupApi {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    // Retrieves detailed address information based on country, postal code, and house number.
    async getAddressDetails(country: string, postalCode: string, houseNumber: string): Promise<APIResponse> {
        return await this.request.get(API_ROUTES.postcodeLookup, {
            params: {
                country: country,
                postcode: postalCode,
                house_number: houseNumber
            }
        });
    }
}