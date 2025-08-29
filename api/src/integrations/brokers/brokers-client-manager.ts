import { CredentialsService } from "../../modules/credentials/credentials.service";
import { EncryptionService } from "../../shared/utils/encryption";
import { ExchangeType } from './futures/interfaces/brokers-account.interfaces';
import { BrokersClient } from './brokers-client';
import { BrokerClient } from './interfaces/brokers.interfaces';

export class BrokersClientManager {
    private static clients: Record<string, BrokerClient> = {};
    private static credentialsService = new CredentialsService();
    private static encryptionService = new EncryptionService();


    static async initializeClients(): Promise<Record<string, BrokerClient>> {
        try {
            const credentials = await this.credentialsService.getAllCredentials();

            const decryptedCredentials = await Promise.all(
                credentials.map(async (credential) => ({
                    ...credential,
                    api_key: await this.encryptionService.decrypt(credential.api_key),
                    api_secret: await this.encryptionService.decrypt(credential.api_secret)
                }))
            );

            for (const credential of decryptedCredentials) {
                const client = BrokersClient.createClient(credential);
                if (client) {
                    const key = `${credential.user_uuid}_${credential.type}`;
                    this.clients[key] = client;
                } else {
                    console.log('Failed to create client for credential:', credential.user_uuid, credential.type);
                }
            }

            return this.clients;
        } catch (error) {
            throw new Error(`Failed to initialize exchange clients: ${error}`);
        }
    }

    static async getClientForUser(user_uuid: string, type: ExchangeType): Promise<BrokerClient> {
        const key = `${user_uuid}_${type}`;

        if (!this.clients[key]) {
            const creds = await this.credentialsService.getUserCredentialByType(user_uuid, type);

            if (!creds) {
                throw new Error(`No ${type} credentials found for user ${user_uuid}`);
            }

            const decryptedApiKey = await this.encryptionService.decrypt(creds.api_key);
            const decryptedApiSecret = await this.encryptionService.decrypt(creds.api_secret);

            const client = BrokersClient.createClient({
                ...creds,
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


    static async addClient(user_uuid: string, type: ExchangeType, api_key: string, api_secret: string): Promise<void> {
        try {
            const client = BrokersClient.createClient({
                user_uuid,
                type,
                api_key,
                api_secret
            });

            if (client) {
                const key = `${user_uuid}_${type}`;
                this.clients[key] = client;
            }
        } catch (error) {
            throw new Error(`Failed to add client: ${error}`);
        }
    }

    static async removeClient(user_uuid: string, type: ExchangeType): Promise<void> {
        const key = `${user_uuid}_${type}`;
        if (this.clients[key]) {
            delete this.clients[key];
        }
    }

    static async refreshClients(): Promise<Record<string, BrokerClient>> {
        this.clients = {};
        return await this.initializeClients();
    }

    static async getClients(): Promise<Record<string, BrokerClient>> {
        if (Object.keys(this.clients).length === 0) {
            await this.refreshClients();
        }
        return this.clients;
    }



}
