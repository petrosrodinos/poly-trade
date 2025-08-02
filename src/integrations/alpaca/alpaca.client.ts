import Alpaca from '@alpacahq/alpaca-trade-api';
import { AlpacaConfig } from './alpaca.config';

export class AlpacaClient {
    private alpaca: Alpaca;

    constructor(config: AlpacaConfig) {
        this.alpaca = new Alpaca({
            keyId: config.keyId,
            secretKey: config.secretKey,
            paper: config.paper,
            baseUrl: 'https://paper-api.alpaca.markets'
        });
    }

    getClient(): Alpaca {
        return this.alpaca;
    }
}