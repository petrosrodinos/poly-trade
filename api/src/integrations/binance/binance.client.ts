
const Binance = require('node-binance-api');
import { logger } from '../../shared/utils/logger';
import dotenv from 'dotenv';
dotenv.config();

export class BinanceClient {
    private binance: any;

    constructor(apiKey: string, secretKey: string) {
        const useTestnet = process.env.BINANCE_USE_TESTNET === 'true';

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

        logger.debug(`Binance client initialized successfully (${useTestnet ? 'Testnet' : 'Mainnet'} mode)`);
    }

    getClient() {
        return this.binance;
    }


}