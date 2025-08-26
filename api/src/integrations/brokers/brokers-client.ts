import ccxt, { Exchange } from 'ccxt';
import { logger } from '../../shared/utils/logger';
import { Credential } from './futures/interfaces/brokers-account.interfaces';
import { BrokerClient } from './interfaces/brokers.interfaces';

export class BrokersClient {

    static createClient(credential: Credential): BrokerClient | null {
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

        const useTestnet = process.env.USE_TESTNET === 'true';

        if (useTestnet) {
            if (exchangeId === 'binance') {
                client.setSandboxMode(true);
            } else if (exchangeId === 'mexc') {
                if (client.urls?.test) {
                    client.urls['api'] = client.urls['test'];
                }
            }
            logger.debug(`${credential.type} TESTNET client initialized for user ${credential.user_uuid}`);
        } else {
            logger.debug(`${credential.type} LIVE client initialized for user ${credential.user_uuid}`);
        }

        return client;
    }
}
