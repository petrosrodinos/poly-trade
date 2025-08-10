import { BinanceCandlestick, BinancePosition } from "../../../../integrations/binance/binance.interfaces";
import { BinanceTradesService } from "../../../../integrations/binance/services/binance-trades.service";
import { BinanceStreamingService } from "../../../../integrations/binance/services/binance-streaming.service";
import { logger } from "../../../../shared/utils/logger";
import { BotModel } from "./models/bot.model";
import { BotUtils } from "./utils/bot.utils";

interface Candle {
    open: number;
    close: number;
    high: number;
    low: number;
    timestamp: number;
}

export class BotManagerService {
    private binanceStreamingService: BinanceStreamingService;
    private binanceTradesService: BinanceTradesService;
    private botUtils: BotUtils;

    private activeStreams: Set<string> = new Set();
    private candles: Map<string, Candle[]> = new Map();
    private positions: Map<string, 'long' | 'short' | null> = new Map();
    private currentMinute: Map<string, number> = new Map();
    private lastTradeTime: Map<string, number> = new Map();
    private streamEndpoints: Map<string, any> = new Map();

    constructor(
    ) {
        this.binanceStreamingService = new BinanceStreamingService();
        this.binanceTradesService = new BinanceTradesService();
        this.botUtils = new BotUtils();
    }

    public async startBot(bot: BotModel): Promise<void> {
        try {
            if (this.activeStreams.has(bot.id)) return;

            this.activeStreams.add(bot.id);
            this.candles.set(bot.id, []);
            this.positions.set(bot.id, null);

            const streamEndpoint = this.binanceStreamingService.streamCandlesticksFutures(
                bot.symbol,
                bot.timeframe,
                (data: BinanceCandlestick) => this.processCandlestick(bot, data)
            );

            this.streamEndpoints.set(bot.id, streamEndpoint);

            logger.success(`Started ${bot.symbol} bot, ID: ${bot.id}`);
        } catch (error) {
            logger.error(`Error starting bot ${bot.symbol}, ID: ${bot.id}:`, error);
            throw error;
        }
    }

    public async stopBot(bot: BotModel): Promise<void> {
        try {
            if (!this.activeStreams.has(bot.id)) return;

            const streamEndpoint = this.streamEndpoints.get(bot.id);
            if (streamEndpoint) {
                streamEndpoint.close();
                await this.binanceStreamingService.terminateStream(`${bot.symbol.toLowerCase()}@kline_${bot.timeframe}`);
                this.streamEndpoints.delete(bot.id);
            }

            await this.binanceTradesService.closePosition(bot.symbol);

            this.activeStreams.delete(bot.id);
            this.candles.delete(bot.id);
            this.positions.delete(bot.id);
            this.currentMinute.delete(bot.id);
            this.lastTradeTime.delete(bot.id);


            logger.success(`Stopped bot ${bot.symbol}, ID: ${bot.id}`);
        } catch (error) {
            logger.error(`Error stopping bot ${bot.symbol}, ID: ${bot.id}:`, error);
            throw error;
        }
    }

    private async processCandlestick(bot: BotModel, candlestick: BinanceCandlestick): Promise<void> {
        try {
            if (!bot.active) return;
            if (!candlestick.isKlineClosed) return;

            const timeframeMs = this.botUtils.getTimeframeInMiliseconds(bot.timeframe);
            const minute = Math.floor(candlestick.timestamp / timeframeMs);
            const lastProcessedMinute = this.lastTradeTime.get(bot.id) || -1;
            const lastStoredMinute = this.currentMinute.get(bot.id) || -1;

            if (lastStoredMinute === minute) return;

            const candles = this.candles.get(bot.id) || [];

            if (candles.length > 0 && lastProcessedMinute !== minute) {
                const lastCandle = candles[candles.length - 1];
                await this.processCandle(bot, lastCandle);
                this.lastTradeTime.set(bot.id, minute);
            }

            candles.push({
                open: candlestick.open,
                close: candlestick.close,
                high: candlestick.high,
                low: candlestick.low,
                timestamp: candlestick.timestamp
            });
            this.candles.set(bot.id, candles);
            this.currentMinute.set(bot.id, minute);
        } catch (error) {
            logger.error(`Error processing candlestick for ${bot.symbol} ID: ${bot.id}:`, error);
            throw error;
        }
    }

    private async processCandle(bot: BotModel, candle: Candle): Promise<void> {
        const candles = this.candles.get(bot.id) || [];
        if (candles.length < 1) return;

        const previousCandle = candles[candles.length - 1];
        const isCurrentGreen = candle.close > candle.open;
        const isPreviousGreen = previousCandle.close > previousCandle.open;
        const currentPosition = this.positions.get(bot.id);
        const quantity = bot.quantity;

        if (quantity === 0) return;

        try {
            if (isCurrentGreen && isPreviousGreen && currentPosition !== 'long') {
                if (currentPosition === 'short') {
                    await this.binanceTradesService.closePosition(bot.symbol);
                }
                const position = await this.binanceTradesService.openPosition(bot.symbol, 'buy', candle.close, quantity, bot.leverage);
                this.positions.set(bot.id, 'long');
                logger.long(`${bot.symbol}, ${candle.close}, ${quantity}, ID: ${bot.id}, ${position.orderId}`);
            } else if (!isCurrentGreen && currentPosition !== 'short') {
                if (currentPosition === 'long') {
                    await this.binanceTradesService.closePosition(bot.symbol);
                }
                const position = await this.binanceTradesService.openPosition(bot.symbol, 'sell', candle.close, quantity, bot.leverage);
                this.positions.set(bot.id, 'short');
                logger.short(`${bot.symbol}, ${candle.close}, ${quantity}, ID: ${bot.id}, ${position.orderId}`);
            }
        } catch (error) {
            logger.error(`Error processing candle for ${bot.symbol} ID: ${bot.id}:`, error);
        }
    }



}
