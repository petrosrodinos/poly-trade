import { BinanceClient } from "../binance.client";
import { Request } from "express";

export class BinanceStreamingService {
    private binanceClient: any;
    private activeStreams: Map<string, string> = new Map();

    constructor() {
        const client = new BinanceClient();
        this.binanceClient = client.getClient();
    }

    streamCandlesticks(symbol: string, req: Request, callback: (data: any) => void) {

        try {

            // const clientId = `${req.ip || 'unknown'}-${Date.now()}`;
            // const streamKey = `candlestick-${symbol}-${clientId}`;

            // if (this.activeStreams.has(streamKey)) {
            //     console.log(`Terminating existing stream for ${streamKey}`);
            //     this.terminateStream(`${symbol.toLowerCase()}@kline_1m`);
            //     this.activeStreams.delete(streamKey);
            // }

            const streamEndpoint = this.binanceClient.websockets.candlesticks([symbol], "1m", (candlesticks: any) => {
                const kline = candlesticks.k || candlesticks;
                const data = {
                    symbol: kline.s || candlesticks.s || symbol,
                    open: parseFloat(kline.o || '0'),
                    high: parseFloat(kline.h || '0'),
                    low: parseFloat(kline.l || '0'),
                    close: parseFloat(kline.c || '0'),
                    volume: parseFloat(kline.v || '0'),
                    trades: parseInt(kline.n || '0'),
                    interval: kline.i || '1m',
                    timestamp: new Date(kline.t || Date.now()).toISOString(),
                    closeTime: new Date(kline.T || Date.now()).toISOString(),
                    isKlineClosed: kline.x || false
                };
                callback(data);
            });

            // this.activeStreams.set(streamKey, `${symbol.toLowerCase()}@kline_1m`);

            return streamEndpoint;
        } catch (error) {
            console.error(`Error starting candlesticks stream for ${symbol}:`, error);
            throw error;
        }
    }


    async terminateStream(endpoint: string) {
        try {

            const result = await this.binanceClient.websockets.terminate(endpoint);

            console.log(`Terminated stream: ${result}`);

            // this.activeStreams.delete(endpoint);

            setTimeout(() => {
                console.log(`Active subscriptions after termination:`, this.binanceClient.websockets.subscriptions());
            }, 1000);

            return result;
        } catch (error) {
            console.error(`Error terminating stream ${endpoint}:`, error);
            throw error;
        }
    }

    async getStreamStatus(): Promise<any> {
        try {
            const subscriptions = this.getSubscriptions();
            const activeStreams = Array.from(this.activeStreams.keys());

            return {
                activeStreams,
                binanceSubscriptions: subscriptions,
                totalActiveStreams: activeStreams.length,
                totalBinanceSubscriptions: Object.keys(subscriptions).length,
                timestamp: new Date().toISOString()
            }

        } catch (error) {
            console.error('Error getting stream status:', error);
            return { error: 'Failed to get stream status' };
        }
    }


    async terminateAll() {
        try {
            const subscriptions = await this.getSubscriptions();

            console.log(`Terminating all streams: ${subscriptions}`);

            Object.keys(subscriptions).forEach(key => {
                this.binanceClient.websockets.terminate(key);
                // this.activeStreams.delete(key);
            });

            return true;
        } catch (error) {
            console.error(`Error terminating all streams:`, error);
            throw error;
        }
    }

    async getSubscriptions() {
        return await this.binanceClient.websockets.subscriptions();
    }
}
