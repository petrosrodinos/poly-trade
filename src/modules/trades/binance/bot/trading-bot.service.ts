import { BinancePosition, BinanceCandlestick } from "../../../../integrations/binance/binance.interfaces";
import { BinanceTradesService } from "../../../../integrations/binance/services/binance-trades.service";
import { BinanceStreamingService } from "../../../../integrations/binance/services/binance-streaming.service";
import { BinanceAccountService } from "../../../../integrations/binance/services/binance-account.service";
import { TradesConfig } from "../../../../shared/constants/trades";
import { logger } from "../../../../shared/utils/logger";

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
    binanceAccountService: BinanceAccountService;

    private activeStreams: Set<string> = new Set();
    private candles: Map<string, Candle[]> = new Map();
    private positions: Map<string, 'long' | 'short' | null> = new Map();
    private currentMinute: Map<string, number> = new Map();
    private lastTradeTime: Map<string, number> = new Map();
    private streamEndpoints: Map<string, any> = new Map();

    constructor() {
        this.binanceStreamingService = new BinanceStreamingService();
        this.binanceTradesService = new BinanceTradesService();
        this.binanceAccountService = new BinanceAccountService();
    }

    async startBot(symbol: string): Promise<void> {
        try {
            if (this.activeStreams.has(symbol)) {
                return;
            }

            this.activeStreams.add(symbol);
            this.candles.set(symbol, []);
            this.positions.set(symbol, null);

            const streamEndpoint = this.binanceStreamingService.streamCandlesticksFutures(
                symbol,
                {} as any,
                (data: BinanceCandlestick) => {
                    this.processCandlestick(symbol, data);
                }
            );

            this.streamEndpoints.set(symbol, streamEndpoint);

            logger.success(`Started Binance trading bot for ${symbol}`);
        } catch (error) {
            console.error(`Error starting bot for ${symbol}:`, error);
            throw error;
        }
    }

    private async processCandlestick(symbol: string, candlestick: BinanceCandlestick): Promise<void> {
        try {
            if (!candlestick.isKlineClosed) return;

            const minute = Math.floor(candlestick.timestamp / 60000);

            const lastProcessedMinute = this.lastTradeTime.get(symbol) || -1;
            const lastStoredMinute = this.currentMinute.get(symbol) || -1;

            if (lastStoredMinute === minute) return;

            const candles = this.candles.get(symbol) || [];

            if (candles.length > 0 && lastProcessedMinute !== minute) {
                const lastCandle = candles[candles.length - 1];
                await this.processCandle(symbol, lastCandle);
                this.lastTradeTime.set(symbol, minute);
            }

            const newCandle: Candle = {
                open: candlestick.open,
                close: candlestick.close,
                high: candlestick.high,
                low: candlestick.low,
                timestamp: candlestick.timestamp
            };

            candles.push(newCandle);
            this.candles.set(symbol, candles);
            this.currentMinute.set(symbol, minute);

        } catch (error) {
            console.error(`Error processing candlestick for ${symbol}:`, error);
        }
    }


    private async processCandle(symbol: string, candle: Candle): Promise<void> {
        try {
            const candles = this.candles.get(symbol) || [];
            if (candles.length < 1) return;

            const previousCandle = candles[candles.length - 1];
            const isCurrentGreen = candle.close > candle.open;
            const isPreviousGreen = previousCandle.close > previousCandle.open;
            const currentPosition = this.positions.get(symbol);

            const quantity = Math.floor(TradesConfig.amount / candle.close);

            if (isCurrentGreen && isPreviousGreen && currentPosition !== 'long') {
                if (currentPosition === 'short') {
                    await this.binanceTradesService.closePosition(symbol);
                }
                const position = await this.binanceTradesService.openPosition(symbol, 'buy', candle.close, quantity);
                this.positions.set(symbol, 'long');
                logger.long(`${symbol}, ${candle.close}, ${quantity}, ${position.orderId}`);
            } else if (!isCurrentGreen && currentPosition !== 'short') {
                if (currentPosition === 'long') {
                    await this.binanceTradesService.closePosition(symbol);
                }
                const position = await this.binanceTradesService.openPosition(symbol, 'sell', candle.close, quantity);
                this.positions.set(symbol, 'short');
                logger.short(`${symbol}, ${candle.close}, ${quantity}, ${position.orderId}`);
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
                    await this.binanceStreamingService.terminateStream(`${symbol.toLowerCase()}@kline_${TradesConfig.timeframe}`);
                    this.streamEndpoints.delete(symbol);
                }

                this.activeStreams.delete(symbol);
                this.candles.delete(symbol);
                this.positions.delete(symbol);
                this.currentMinute.delete(symbol);
                this.lastTradeTime.delete(symbol);

                await this.binanceTradesService.closePosition(symbol);
                logger.success(`Stopped bot for ${symbol}`);
            }
        } catch (error) {
            console.error(`Error stopping bot for ${symbol}:`, error);
            throw error;
        }
    }

    isBotRunning(symbol: string): boolean {
        return this.activeStreams.has(symbol);
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