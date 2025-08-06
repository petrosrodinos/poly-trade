import { BinanceAccount, BinancePosition, BinanceCandlestick } from "../../../../integrations/binance/binance.interfaces";
import { BinanceTradesService } from "../../../../integrations/binance/services/binance-trades.service";
import { BinanceStreamingService } from "../../../../integrations/binance/services/binance-streaming.service";

interface Candle {
    open: number;
    close: number;
    high: number;
    low: number;
    timestamp: number;
}

export class BinanceTradingBotService {
    binanceStreamingService: BinanceStreamingService;
    binanceTradesService: BinanceTradesService;

    private activeStreams: Set<string> = new Set();
    private candles: Map<string, Candle[]> = new Map();
    private positions: Map<string, 'long' | 'short' | null> = new Map();
    private currentMinute: Map<string, number> = new Map();
    private lastTradeTime: Map<string, number> = new Map();
    private streamEndpoints: Map<string, any> = new Map();

    constructor() {
        this.binanceStreamingService = new BinanceStreamingService();
        this.binanceTradesService = new BinanceTradesService();
    }

    async startBot(symbol: string): Promise<void> {
        try {
            if (this.activeStreams.has(symbol)) {
                return;
            }

            this.activeStreams.add(symbol);
            this.candles.set(symbol, []);
            this.positions.set(symbol, null);

            const streamEndpoint = this.binanceStreamingService.streamCandlesticks(
                symbol,
                {} as any,
                (data: BinanceCandlestick) => {
                    this.processCandlestick(symbol, data);
                }
            );

            this.streamEndpoints.set(symbol, streamEndpoint);

            console.log(`Started Binance trading bot for ${symbol}`);
        } catch (error) {
            console.error(`Error starting bot for ${symbol}:`, error);
            throw error;
        }
    }

    private async processCandlestick(symbol: string, candlestick: BinanceCandlestick): Promise<void> {
        try {
            if (!candlestick.isKlineClosed) {
                return;
            }

            const timestamp = new Date(candlestick.timestamp).getTime();
            const minute = Math.floor(timestamp / 60000);
            const currentStoredMinute = this.currentMinute.get(symbol);
            const lastTradeMinute = this.lastTradeTime.get(symbol);

            if (currentStoredMinute !== minute) {
                const candles = this.candles.get(symbol) || [];

                if (candles.length > 0 && lastTradeMinute !== minute) {
                    const lastCandle = candles[candles.length - 1];
                    await this.processCandle(symbol, lastCandle);
                    this.lastTradeTime.set(symbol, minute);
                }

                const newCandle: Candle = {
                    open: candlestick.open,
                    close: candlestick.close,
                    high: candlestick.high,
                    low: candlestick.low,
                    timestamp
                };

                this.candles.set(symbol, [...candles, newCandle]);
                this.currentMinute.set(symbol, minute);

                console.log(`New candle for ${symbol}:`, newCandle);
            }
        } catch (error) {
            console.error(`Error processing candlestick for ${symbol}:`, error);
        }
    }

    private async processCandle(symbol: string, candle: Candle): Promise<void> {
        try {
            const candles = this.candles.get(symbol) || [];
            if (candles.length < 2) return;

            const previousCandle = candles[candles.length - 2];
            const isCurrentGreen = candle.close > candle.open;
            const isPreviousGreen = previousCandle.close > previousCandle.open;
            const currentPosition = this.positions.get(symbol);

            if (isCurrentGreen && isPreviousGreen && currentPosition !== 'long') {
                if (currentPosition === 'short') {
                    await this.binanceTradesService.closePosition(symbol);
                }
                await this.binanceTradesService.openPosition(symbol, 'buy', candle.close, 10);
                this.positions.set(symbol, 'long');
                console.log(`Opened LONG position for ${symbol} at ${candle.close}`);
            } else if (!isCurrentGreen && currentPosition !== 'short') {
                if (currentPosition === 'long') {
                    await this.binanceTradesService.closePosition(symbol);
                }
                await this.binanceTradesService.openPosition(symbol, 'sell', candle.close, 10);
                this.positions.set(symbol, 'short');
                console.log(`Opened SHORT position for ${symbol} at ${candle.close}`);
            }
        } catch (error) {
            console.error(`Error processing candle for ${symbol}:`, error);
        }
    }

    async stopBot(symbol: string): Promise<void> {
        try {
            if (this.activeStreams.has(symbol)) {
                const streamEndpoint = this.streamEndpoints.get(symbol);
                if (streamEndpoint) {
                    await this.binanceStreamingService.terminateStream(`${symbol.toLowerCase()}@kline_1m`);
                    this.streamEndpoints.delete(symbol);
                }

                this.activeStreams.delete(symbol);
                this.candles.delete(symbol);
                this.positions.delete(symbol);
                this.currentMinute.delete(symbol);
                this.lastTradeTime.delete(symbol);

                await this.binanceTradesService.closePosition(symbol);
                console.log(`Stopped bot for ${symbol}`);
            }
        } catch (error) {
            console.error(`Error stopping bot for ${symbol}:`, error);
            throw error;
        }
    }

    isBotRunning(symbol: string): boolean {
        return this.activeStreams.has(symbol);
    }

    async getAccountStatus(): Promise<BinanceAccount> {
        return this.binanceTradesService.getAccount();
    }

    async getPositionInfo(symbol: string): Promise<BinancePosition | null> {
        return this.binanceTradesService.getPosition(symbol);
    }

    getBotStatus(symbol: string): any {
        return {
            symbol,
            isRunning: this.isBotRunning(symbol),
            position: this.positions.get(symbol) || 'none',
            lastCandle: this.candles.get(symbol)?.slice(-1)[0] || null,
            totalCandles: this.candles.get(symbol)?.length || 0
        };
    }

    async getAllPositions(): Promise<BinancePosition[]> {
        try {
            const account = await this.binanceTradesService.getAccount();
            const positions: BinancePosition[] = [];

            for (const symbol of this.activeStreams) {
                const position = await this.binanceTradesService.getPosition(symbol);
                if (position) {
                    positions.push(position);
                }
            }

            return positions;
        } catch (error) {
            console.error('Error getting all positions:', error);
            throw error;
        }
    }
}