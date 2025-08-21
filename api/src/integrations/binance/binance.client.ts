
const Binance = require('node-binance-api');
import { logger } from '../../shared/utils/logger';
import dotenv from 'dotenv';
dotenv.config();

export class BinanceClient {
    private binance: any;
    private static instance: any = null;

    constructor() {
        const useTestnet = process.env.BINANCE_USE_TESTNET === 'true';
        let apiKey = process.env.BINANCE_ADMIN_API_KEY
        let secretKey = process.env.BINANCE_ADMIN_SECRET_KEY

        if (!apiKey || !secretKey) {
            throw new Error('Binance API credentials are required. Please set BINANCE_ADMIN_API_KEY and BINANCE_ADMIN_SECRET_KEY environment variables.');
        }

        const baseUrlFutures = useTestnet
            ? 'https://testnet.binancefuture.com/fapi/'
            : 'https://fapi.binance.com/fapi/';

        this.binance = new Binance().options({
            APIKEY: apiKey,
            APISECRET: secretKey,
            useServerTime: true,
            recvWindow: 60000,
            futures: true,
            reconnect: true,
            urls: {
                base: "https://api.binance.com/api/",
                fapi: baseUrlFutures,
                sapi: "https://api.binance.com/sapi/",
                wapi: "https://api.binance.com/wapi/",
                stream: useTestnet
                    ? "wss://stream.binancefuture.com/ws"
                    : "wss://fstream.binance.com/ws",
            },
        });

        // this.binance.baseURL = baseUrl;
        // this.binance.fapi = baseUrl;
        // this.binance.futures = true;

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