
const Binance = require('node-binance-api');
import { logger } from '../../shared/utils/logger';
import dotenv from 'dotenv';
dotenv.config();

export class BinanceClient {
    private binance: any;
    private static instance: any = null;

    constructor() {
        const useTestnet = process.env.BINANCE_USE_TESTNET === 'true';
        let apiKey;
        let secretKey;

        if (useTestnet) {
            apiKey = process.env.BINANCE_API_KEY_TEST
            secretKey = process.env.BINANCE_SECRET_KEY_TEST
        } else {
            apiKey = process.env.BINANCE_API_KEY_LIVE
            secretKey = process.env.BINANCE_SECRET_KEY_LIVE
        }

        if (!apiKey || !secretKey) {
            throw new Error('Binance API credentials are required. Please set BINANCE_API_KEY and BINANCE_SECRET_KEY environment variables.');
        }

        this.binance = new Binance().options({
            APIKEY: apiKey,
            APISECRET: secretKey,
            test: useTestnet,
            verbose: process.env.NODE_ENV === 'development',
            useServerTime: true,
            reconnect: true,
            recvWindow: 60000,
            futures: true,
            urls: {
                base: 'https://testnet.binancefuture.com',
            },
            log: (msg: string) => {
                console.log(`[Binance${useTestnet ? ' Testnet' : ''}]: ${msg}`);
            }
        });

        logger.debug(`Binance client initialized successfully (${useTestnet ? 'Testnet' : 'Mainnet'} mode)`);
    }


    public static getInstance(): BinanceClient {
        if (!BinanceClient.instance) {
            BinanceClient.instance = new BinanceClient();
        }
        return BinanceClient.instance;
    }

    public static getClient(): any {
        return BinanceClient.getInstance().binance;
    }
}