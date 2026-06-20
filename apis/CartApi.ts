import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_ROUTES } from '../constants/routes';

export class CartApi {
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

    //Creates a new dynamic shopping cart session on the backend server.
    async createCart(): Promise<APIResponse> {
        return await this.request.post(API_ROUTES.createCart, {
            headers: this.headers
        });
    }

     //Adds a specific product variant with a specified quantity into the active shopping cart session.    
    async addToCart(cartId: string, productId: string, quantity: number): Promise<APIResponse> {
        return await this.request.post(`${API_ROUTES.createCart}/${cartId}`, {
            headers: this.headers,
            data: {
                product_id: productId,
                quantity: quantity
            }
        });
    }
}