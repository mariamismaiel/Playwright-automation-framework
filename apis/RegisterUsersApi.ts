import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_ROUTES } from '../constants/routes';

export class RegisterUsersApi {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    // Registers a new customer account on the system via backend API.
    async registerUser(userData: object): Promise<APIResponse> {
        return await this.request.post(API_ROUTES.register, { 
            data: userData 
        });
    }
}