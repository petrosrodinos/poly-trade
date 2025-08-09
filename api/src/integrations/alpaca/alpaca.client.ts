import Alpaca from '@alpacahq/alpaca-trade-api';
import { AlpacaConfig, getAlpacaConfig } from './alpaca.config';

export class AlpacaClient {
    private alpaca: Alpaca;
    private config: AlpacaConfig;

    constructor() {
        this.config = getAlpacaConfig();
        this.alpaca = new Alpaca({
            keyId: this.config.keyId,
            secretKey: this.config.secretKey,
            paper: this.config.paper,
            baseUrl: 'https://paper-api.alpaca.markets'
        });
    }

    getClient(): Alpaca {
        return this.alpaca;
    }
}