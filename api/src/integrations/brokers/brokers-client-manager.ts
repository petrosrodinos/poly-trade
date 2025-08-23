import { Exchange } from 'ccxt';
import { CredentialsService } from "../../modules/credentials/credentials.service";
import { EncryptionService } from "../../shared/utils/encryption";
import { ExchangeType } from './interfaces/brokers.interfaces';
import { BrokersClient } from './brokers-client';

export class BrokersClientManager {
    private static clients: Record<string, Exchange> = {};
    private static credentialsService = new CredentialsService();
    private static encryptionService = new EncryptionService();


    static async initializeClients(): Promise<Record<string, Exchange>> {
        try {
            const credentials = await this.credentialsService.getAllCredentials();

            const decryptedCredentials = await Promise.all(
                credentials.map(async (credential) => ({
                    ...credential,
                    type: credential.type as ExchangeType,
                    api_key: await this.encryptionService.decrypt(credential.api_key),
                    api_secret: await this.encryptionService.decrypt(credential.api_secret)
                }))
            );

            for (const credential of decryptedCredentials) {
                const client = BrokersClient.createClient(credential);
                if (client) {
                    const key = `${credential.user_uuid}_${credential.type}`;
                    this.clients[key] = client;
                }
            }

            return this.clients;
        } catch (error) {
            throw new Error(`Failed to initialize exchange clients: ${error}`);
        }
    }

    static async getClientForUser(user_uuid: string, type: ExchangeType): Promise<Exchange> {
        const key = `${user_uuid}_${type}`;

        if (!this.clients[key]) {
            const creds = await this.credentialsService.getUserCredential(user_uuid);

            if (!creds || creds.type !== type) {
                throw new Error(`No ${type} credentials found for user ${user_uuid}`);
            }

            const decryptedApiKey = await this.encryptionService.decrypt(creds.api_key);
            const decryptedApiSecret = await this.encryptionService.decrypt(creds.api_secret);

            const client = BrokersClient.createClient({
                ...creds,
                type: creds.type as ExchangeType,
                api_key: decryptedApiKey,
                api_secret: decryptedApiSecret,
            });

            if (!client) {
                throw new Error(`Exchange type ${type} not supported`);
            }

            this.clients[key] = client;
        }

        return this.clients[key];
    }


    static async getClients(): Promise<Record<string, Exchange>> {
        return this.clients;
    }



}
