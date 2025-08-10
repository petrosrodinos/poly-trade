import { BinanceTradesService } from "../../../../integrations/binance/services/binance-trades.service";
import { BinanceAccountService } from "../../../../integrations/binance/services/binance-account.service";
import { logger } from "../../../../shared/utils/logger";
import { BotFormData } from "./dto/bot.dto";
import { BotModel } from "./models/bot.model";
import { AccountUtils } from "../../../../integrations/binance/utils/account.utils";
import { BotManagerService } from "./bot-manager.service";

export class BinanceTradingBotService {
    binanceTradesService: BinanceTradesService;
    binanceAccountService: BinanceAccountService;
    binanceAccountUtils: AccountUtils;
    botManagerService: BotManagerService;

    private bots: Map<string, BotModel> = new Map();

    constructor() {
        this.binanceTradesService = new BinanceTradesService();
        this.binanceAccountService = new BinanceAccountService();
        this.binanceAccountUtils = new AccountUtils();
        this.botManagerService = new BotManagerService();
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
                throw new Error(`Minimum amount required is ${minQty * (price || 0)} USDT`);
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

            bot.active = true;
            this.bots.set(bot.id, new BotModel(bot));
            this.botManagerService.startBot(bot);

        } catch (error) {
            console.error(`Error starting bot for ${bot.id}:`, error);
            throw error;
        }
    }



    async stopBot(bot: BotModel): Promise<void> {
        try {
            bot.active = false;
            this.bots.set(bot.id, new BotModel(bot));
            this.botManagerService.stopBot(bot);
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

    async deleteBot(id: string): Promise<void> {
        try {
            const bot = this.bots.get(id) || null;
            if (bot) {
                await this.stopBot(bot);
            }
            this.bots.delete(id);
        } catch (error) {
            throw new Error(`Failed to delete bot: ${error}`);
        }
    }

    async startAllBots(): Promise<void> {
        try {
            const bots = Array.from(this.bots.values());
            for (const bot of bots) {
                await this.startBot(bot);
            }
        } catch (error) {
            throw new Error(`Failed to start all bots: ${error}`);
        }
    }

    async stopAllBots(): Promise<void> {
        try {
            const bots = Array.from(this.bots.values());
            for (const bot of bots) {
                await this.stopBot(bot);
            }
        } catch (error) {
            throw new Error(`Failed to stop all bots: ${error}`);
        }
    }



}