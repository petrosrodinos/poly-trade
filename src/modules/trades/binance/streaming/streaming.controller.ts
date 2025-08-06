import { BinanceStreamingService } from "../../../../integrations/binance/services/binance-streaming.service";
import { Request, Response } from "express";

export class BinanceStreamingController {
    private streamingService: BinanceStreamingService;

    constructor() {
        this.streamingService = new BinanceStreamingService();
    }

    streamTickerPrice = (req: Request, res: Response): void => {
        try {
            const symbol = req.params.symbol?.toUpperCase();
            if (!symbol) {
                res.status(400).json({ error: 'Symbol parameter is required' });
                return;
            }

            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');

            res.write('data: {"status": "connected"}\n\n');

            console.log(`Starting stream for symbol: ${symbol}`);

            this.streamingService.streamCandlesticks(symbol, req, (candlestick: any) => {
                try {
                    console.log(`Sending candlestick data for ${symbol}:`, candlestick);

                    res.write(`data: ${JSON.stringify(candlestick)}\n\n`);
                } catch (formatError) {
                    console.error('Error formatting candlestick data:', formatError);
                }
            });

            req.on('close', () => {
                this.streamingService.terminateStream(`${symbol.toLowerCase()}@kline_1m`);
            });

            req.on('error', (error) => {
                console.error('Request error:', error);
                this.streamingService.terminateStream(`${symbol.toLowerCase()}@kline_1m`);
            });

        } catch (error) {
            console.error('Error streaming candlesticks:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Failed to stream candlesticks' });
            }
        }
    }


    getStreamStatus = async (req: Request, res: Response): Promise<void> => {
        try {

            const status = await this.streamingService.getStreamStatus();

            res.json(status);

        } catch (error) {
            console.error('Error getting stream status:', error);
            res.status(500).json({ error: 'Failed to get stream status' });
        }
    }

    terminateAllStreams = async (req: Request, res: Response): Promise<void> => {
        try {

            const result = await this.streamingService.terminateAll();

            if (result) {
                res.json({
                    message: 'All streams terminated',
                    timestamp: new Date().toISOString()
                });
            } else {
                res.status(500).json({ error: 'Failed to terminate all streams' });
            }

        } catch (error) {
            console.error('Error terminating all streams:', error);
            res.status(500).json({ error: 'Failed to terminate all streams' });
        }
    }
}