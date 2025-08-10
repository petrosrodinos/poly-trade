import { BinancePosition, BinanceCandlestick } from "../../../../integrations/binance/binance.interfaces";
import { BinanceTradesService } from "../../../../integrations/binance/services/binance-trades.service";
import { BinanceStreamingService } from "../../../../integrations/binance/services/binance-streaming.service";
import { BinanceAccountService } from "../../../../integrations/binance/services/binance-account.service";
import { logger } from "../../../../shared/utils/logger";
import { BotFormData } from "./dto/bot.dto";
import { BotModel } from "./models/bot.model";
import { BotUtils } from "./utils/bot.utils";
import { AccountUtils } from "../../../../integrations/binance/utils/account.utils";

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
    binanceAccountUtils: AccountUtils;
    botUtils: BotUtils;

    private bots: Map<string, BotModel> = new Map();
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
        this.binanceAccountUtils = new AccountUtils();
        this.botUtils = new BotUtils();
    }

    async createBot(botData: BotFormData): Promise<BotModel> {
        try {

            const existingBot = Array.from(this.bots.values()).find((bot: BotModel) => bot.symbol === botData.symbol);
            if (existingBot) {
                throw new Error('Bot already exists');
            }

            const balance = await this.binanceAccountService.getAccountBalance("USDT");

            if (balance < botData.amount) {
                throw new Error('Insufficient balance to create bot');
            }

            const price = await this.binanceTradesService.getFuturesPrices(botData.symbol);

            const { minQty, stepSize } = await this.binanceTradesService.getExchangeInfo(botData.symbol);

            const quantityValue = this.binanceAccountUtils.calculateQuantity(botData.amount, price || 0, minQty, stepSize);

            if (quantityValue === 0) {
                throw new Error('Insufficient balance to create bot');
            }

            const bot: BotModel = {
                // id: `bot_${botData.symbol}_${Date.now()}`,
                id: `${this.bots.size + 1}`,
                symbol: botData.symbol,
                amount: botData.amount,
                timeframe: botData.timeframe,
                leverage: botData.leverage,
                active: botData.active,
                quantity: quantityValue,
                created_at: new Date().toISOString(),
            };

            this.bots.set(bot.id, new BotModel(bot));

            logger.success(`Bot created for ${botData.symbol}, ID: ${bot.id}`);

            if (botData.active) {
                this.startBot(bot);
            }

            return bot;

        } catch (error) {
            throw error;
        }
    }

    async startBot(bot: BotModel): Promise<void> {
        try {
            if (this.activeStreams.has(bot.id)) {
                return;
            }

            bot.active = true;
            this.bots.set(bot.id, bot);

            this.activeStreams.add(bot.id);
            this.candles.set(bot.id, []);
            this.positions.set(bot.id, null);

            const streamEndpoint = this.binanceStreamingService.streamCandlesticksFutures(
                bot.symbol,
                bot.timeframe,
                (data: BinanceCandlestick) => {
                    this.processCandlestick(bot, data);
                }
            );

            this.streamEndpoints.set(bot.id, streamEndpoint);

            logger.success(`Started ${bot.symbol} bot, ID: ${bot.id}`);
        } catch (error) {
            console.error(`Error starting bot for ${bot.id}:`, error);
            throw error;
        }
    }

    private async processCandlestick(bot: BotModel, candlestick: BinanceCandlestick): Promise<void> {
        try {

            const { id, timeframe, active } = bot;

            if (!active) return;

            const timeframeInMiliseconds = this.botUtils.getTimeframeInMiliseconds(timeframe);

            if (!candlestick.isKlineClosed) return;

            const minute = Math.floor(candlestick.timestamp / timeframeInMiliseconds);

            const lastProcessedMinute = this.lastTradeTime.get(id) || -1;
            const lastStoredMinute = this.currentMinute.get(id) || -1;

            if (lastStoredMinute === minute) return;

            const candles = this.candles.get(id) || [];

            if (candles.length > 0 && lastProcessedMinute !== minute) {
                const lastCandle = candles[candles.length - 1];
                await this.processCandle(bot, lastCandle);
                this.lastTradeTime.set(id, minute);
            }

            const newCandle: Candle = {
                open: candlestick.open,
                close: candlestick.close,
                high: candlestick.high,
                low: candlestick.low,
                timestamp: candlestick.timestamp
            };

            candles.push(newCandle);
            this.candles.set(id, candles);
            this.currentMinute.set(id, minute);

        } catch (error) {
            console.error(`Error processing candlestick for ${bot.id}:`, error);
        }
    }


    private async processCandle(bot: BotModel, candle: Candle): Promise<void> {
        const { id, symbol, quantity, leverage } = bot;

        try {

            const candles = this.candles.get(id) || [];
            if (candles.length < 1) return;

            const previousCandle = candles[candles.length - 1];
            const isCurrentGreen = candle.close > candle.open;
            const isPreviousGreen = previousCandle.close > previousCandle.open;
            const currentPosition = this.positions.get(id);

            if (quantity === 0) return;

            if (isCurrentGreen && isPreviousGreen && currentPosition !== 'long') {
                if (currentPosition === 'short') {
                    await this.binanceTradesService.closePosition(symbol);
                }
                const position = await this.binanceTradesService.openPosition(symbol, 'buy', candle.close, quantity, leverage);
                this.positions.set(id, 'long');
                logger.long(`${symbol}, ${candle.close}, ${quantity}, ID: ${id}, ${position.orderId}`);
            } else if (!isCurrentGreen && currentPosition !== 'short') {
                if (currentPosition === 'long') {
                    await this.binanceTradesService.closePosition(symbol);
                }
                const position = await this.binanceTradesService.openPosition(symbol, 'sell', candle.close, quantity, leverage);
                this.positions.set(id, 'short');
                logger.short(`${symbol}, ${candle.close}, ${quantity}, ID: ${id}, ${position.orderId}`);
            }
        } catch (error) {
            logger.error(`Error processing candle for ${symbol} ID: ${id}:`, error);
        }
    }

    async stopBot(bot: BotModel): Promise<void> {
        try {
            if (this.activeStreams.has(bot.id)) {
                const streamEndpoint = this.streamEndpoints.get(bot.id);
                if (streamEndpoint) {
                    streamEndpoint.close();
                    await this.binanceStreamingService.terminateStream(`${bot.symbol.toLowerCase()}@kline_${bot.timeframe}`);
                    this.streamEndpoints.delete(bot.id);
                }

                this.activeStreams.delete(bot.id);
                this.candles.delete(bot.id);
                this.positions.delete(bot.id);
                this.currentMinute.delete(bot.id);
                this.lastTradeTime.delete(bot.id);
                bot.active = false;

                this.bots.set(bot.id, bot);

                await this.binanceTradesService.closePosition(bot.symbol);
                logger.success(`Stopped: ${bot.symbol} for ${bot.id}`);
            }
        } catch (error) {
            logger.error(`Error stopping bot: ${bot.symbol} for ${bot.id}:`, error);
            throw error;
        }
    }


    async getBot(id: string): Promise<BotModel | null> {
        let bot = this.bots.get(id) || null;

        if (bot?.id) {
            const { profit } = await this.binanceAccountService.getFuturesIncomeTradesAndProfit(bot.symbol);
            const { trades } = await this.binanceAccountService.getFuturesUserTradesAndProfit(bot.symbol);
            bot.trades = trades;
            bot.profit = profit;
        }

        return bot;
    }

    async getBots(): Promise<BotModel[]> {
        try {
            const bots = Array.from(this.bots.values());
            const botsWithData = await Promise.all(
                bots.map(async (bot) => {
                    try {
                        const { profit } = await this.binanceAccountService.getFuturesIncomeTradesAndProfit(bot.symbol);
                        // const { trades } = await this.binanceAccountService.getFuturesUserTradesAndProfit(bot.symbol);
                        bot.trades = [];
                        bot.profit = profit;
                        return bot;
                    } catch (error) {
                        return bot;
                    }
                })
            );

            return botsWithData;
        } catch (error) {
            throw new Error(`Failed to get bots: ${error}`);
        }
    }

    updateBot(id: string, bot: Partial<BotModel>): BotModel | null {
        try {
            const existingBot = this.bots.get(id);
            if (existingBot) {
                this.bots.set(id, new BotModel({ ...existingBot, ...bot }));
                return this.bots.get(id) || null;
            }
            return null;
        } catch (error) {
            throw new Error(`Failed to update bot: ${error}`);
        }
    }

    deleteBot(id: string): void {
        try {
            this.bots.delete(id);
        } catch (error) {
            throw new Error(`Failed to delete bot: ${error}`);
        }
    }


    async getPositionInfo(symbol: string): Promise<BinancePosition | null> {
        try {
            return this.binanceTradesService.getPosition(symbol);
        } catch (error) {
            throw new Error(`Failed to get position info: ${error}`);
        }
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
            throw error;
        }
    }




}