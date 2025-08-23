import ccxt, { Exchange } from 'ccxt';
import { logger } from '../../shared/utils/logger';
import { Credential } from './interfaces/brokers.interfaces';

export class BrokersClient {
    static createClient(credential: Credential): Exchange | null {
        const exchangeId = credential.type.toLowerCase();

        if (!(exchangeId in ccxt)) {
            logger.error(`Exchange ${credential.type} not supported by ccxt`);
            return null;
        }

        const exchangeClass = (ccxt as any)[exchangeId];

        const client = new exchangeClass({
            apiKey: credential.api_key,
            secret: credential.api_secret,
            ...(credential.passphrase ? { password: credential.passphrase } : {}),
            enableRateLimit: true,
        });

        logger.debug(`${credential.type} client initialized successfully for user ${credential.user_uuid}`);
        return client;
    }
}
