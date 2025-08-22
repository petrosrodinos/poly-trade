import { BinanceClient } from "./binance.client";
import { ClientMap } from "./binance.interfaces";
import { CredentialsService } from "../../modules/credentials/credentials.service";
import { EncryptionService } from "../../shared/utils/encryption";

export class BinanceClientManager {
    private static clients: ClientMap = {};
    private static credentialsService = new CredentialsService();
    private static encryptionService = new EncryptionService();

    static async initializeClients(): Promise<ClientMap> {
        try {
            const credentials = await this.credentialsService.getAllCredentials();

            const decryptedCredentials = await Promise.all(
                credentials.map(async (credential: any) => ({
                    ...credential,
                    api_key: await this.encryptionService.decrypt(credential.api_key),
                    api_secret: await this.encryptionService.decrypt(credential.api_secret)
                }))
            );

            for (const credential of decryptedCredentials) {
                this.clients[credential.user_uuid] = new BinanceClient(credential.api_key, credential.api_secret);
            }

            return this.clients;
        } catch (error) {
            throw new Error(`Failed to initialize Binance clients: ${error}`);
        }
    }

    static async getClientForUser(user_uuid: string): Promise<any> {
        try {
            if (!this.clients[user_uuid]) {
                const creds = await this.credentialsService.getUserCredential(user_uuid);

                if (!creds) {
                    throw new Error(`No Binance credentials found for user ${user_uuid}`);
                }

                const decryptedApiKey = await this.encryptionService.decrypt(creds.api_key);
                const decryptedApiSecret = await this.encryptionService.decrypt(creds.api_secret);

                this.clients[user_uuid] = new BinanceClient(decryptedApiKey, decryptedApiSecret);
            }

            return this.clients[user_uuid].getClient();
        } catch (error) {
            throw new Error("Invalid API key or secret");
        }
    }

    static async getClients(): Promise<any> {
        return this.clients;
    }
}

