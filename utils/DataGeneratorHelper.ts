export class DataGeneratorHelper {
    
    // Generates a unique random email address using the current timestamp
    static generateRandomEmail(): string {
        return `qa.user.${Date.now()}@test.com`;
    }
}