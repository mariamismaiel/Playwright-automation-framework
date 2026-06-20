import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { API_ROUTES } from '../constants/routes';

export class SearchProductsApi {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    
    //Executes a search query via API to look up products matching a specific text.
    async searchProduct(query: string): Promise<APIResponse> {
        return await this.request.get(API_ROUTES.searchProducts, {
            params: {
                q: query
            }
        });
    }

    //Retrieves the first product ID from the search results based on a given product name.
    async getFirstProductIdByName(productName: string): Promise<string> {
        const response = await this.searchProduct(productName);
        expect(response.status()).toBe(200);
        
        const body = await response.json();
        
        // Fail-fast architecture to protect subsequent execution steps
        if (!body.data || body.data.length === 0) {
            throw new Error(`Product Discovery Failed: No products found matching the name "${productName}"`);
        }
        
        return body.data[0].id;
    }
}