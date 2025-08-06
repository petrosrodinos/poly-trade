
const Binance = require('node-binance-api');
import dotenv from 'dotenv';
dotenv.config();

export class BinanceClient {
    private binance: any;

    constructor() {
        const apiKey = process.env.BINANCE_API_KEY;
        const secretKey = process.env.BINANCE_SECRET_KEY;
        const useTestnet = process.env.BINANCE_USE_TESTNET === 'true';

        if (!apiKey || !secretKey) {
            throw new Error('Binance API credentials are required. Please set BINANCE_API_KEY and BINANCE_SECRET_KEY environment variables.');
        }

        this.binance = new Binance({
            APIKEY: apiKey,
            APISECRET: secretKey,
            test: useTestnet,
            verbose: process.env.NODE_ENV === 'development',
            log: (msg: string) => {
                console.log(`[Binance${useTestnet ? ' Testnet' : ''}]: ${msg}`);
            }
        });

        console.log(`Binance client initialized successfully (${useTestnet ? 'Testnet' : 'Mainnet'} mode)`);
    }

    getClient(): any {
        return this.binance;
    }
}