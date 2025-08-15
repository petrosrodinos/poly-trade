import { logger } from "../../../shared/utils/logger";
import { BinanceAccountService } from "../../../integrations/binance/services/binance-account.service";
import { BotModel } from "../models/bot.model";
import { TradesUtils } from "../../../integrations/binance/utils/trades.utils";

export class CryptoTradesService {
    private binanceAccountService: BinanceAccountService;
    private tradesUtils: TradesUtils;

    private bots: Map<string, BotModel> = new Map();

    constructor() {
        this.binanceAccountService = new BinanceAccountService();
        this.tradesUtils = new TradesUtils();
    }

    async createBot(botData: BotModel): Promise<BotModel> {
        try {

            const existingBot = Array.from(this.bots.values()).find((bot: BotModel) => bot.symbol === botData.symbol);
            if (existingBot) {
                throw new Error('Bot already exists');
            }

            const balance = await this.binanceAccountService.getAccountBalance("USDT");

            if (balance < botData.amount) {
                throw new Error('Insufficient balance to create bot');
            }

            const { quantity, minQty, price } = await this.tradesUtils.getTradeQuantity(botData.symbol, botData.amount);

            if (quantity === 0) {
                throw new Error(`Minimum amount required is ${minQty * (price || 0)} USDT`);
            }

            const bot: BotModel = {
                id: `${this.bots.size + 1}`,
                symbol: botData.symbol,
                amount: botData.amount,
                timeframe: botData.timeframe,
                leverage: botData.leverage,
                active: botData.active,
                quantity: quantity,
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
            // this.botManagerService.startBot(bot);

        } catch (error) {
            console.error(`Error starting bot for ${bot.id}:`, error);
            throw error;
        }
    }



    async stopBot(bot: BotModel): Promise<void> {
        try {
            bot.active = false;
            this.bots.set(bot.id, new BotModel(bot));
            // this.botManagerService.stopBot(bot);
        } catch (error) {
            logger.error(`Error stopping bot: ${bot.symbol} for ${bot.id}:`, error);
            throw error;
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