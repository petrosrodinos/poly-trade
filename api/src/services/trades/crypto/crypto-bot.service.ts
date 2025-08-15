import { logger } from "../../../shared/utils/logger";
import { BotModel } from "../models/bot.model";
import { CryptoSubscriptionService } from "./crypto-subscription.service";

export class CryptoBotService {

    public bots: Map<string, BotModel> = new Map();
    private cryptoSubscriptionService: CryptoSubscriptionService;

    constructor() {
        this.cryptoSubscriptionService = new CryptoSubscriptionService(this);
    }

    async createBot(bot: BotModel): Promise<BotModel> {
        try {

            const existingBot = Array.from(this.bots.values()).find((bot: BotModel) => bot.symbol === bot.symbol);

            if (!existingBot) {
                const newBot: BotModel = {
                    uuid: bot.uuid,
                    symbol: bot.symbol,
                    timeframe: bot.timeframe,
                    strategy: bot.strategy,
                    active: bot.active,
                    created_at: bot.created_at,
                    subscriptions: new Map(),
                };

                this.bots.set(newBot.uuid, new BotModel(newBot));

                logger.success(`Bot created for ${newBot.strategy}, ID: ${newBot.uuid}`);

                return newBot;
            }

            return existingBot;

        } catch (error) {
            throw error;
        }
    }

    async startBot(bot_uuid: string): Promise<void> {
        try {

            const bot = this.bots.get(bot_uuid) || null;
            if (bot) {
                bot.active = true;
                this.bots.set(bot_uuid, new BotModel(bot));
                await this.cryptoSubscriptionService.startAllSubscriptions(bot_uuid);
                // this.botManagerService.startBot(bot);
            }

        } catch (error) {
            console.error(`Error starting bot for ${bot_uuid}:`, error);
            throw error;
        }
    }



    async stopBot(bot_uuid: string): Promise<void> {
        try {
            const bot = this.bots.get(bot_uuid) || null;

            if (bot) {
                bot.active = false;
                this.bots.set(bot_uuid, new BotModel(bot));
                await this.cryptoSubscriptionService.stopAllSubscriptions(bot_uuid);
            }

            // this.botManagerService.stopBot(bot);
        } catch (error) {
            logger.error(`Error stopping bot: ${bot_uuid}:`, error);
            throw error;
        }
    }


    async updateBot(uuid: string, bot: Partial<BotModel>): Promise<BotModel | null> {
        try {
            const existingBot = this.bots.get(uuid);
            if (existingBot) {
                this.bots.set(uuid, new BotModel({ ...existingBot, ...bot }));
                return this.bots.get(uuid) || null;
            }
            return null;
        } catch (error) {
            throw new Error(`Failed to update bot: ${error}`);
        }
    }

    async deleteBot(uuid: string): Promise<void> {
        try {
            const bot = this.bots.get(uuid) || null;
            if (bot) {
                await this.stopBot(uuid);
                this.bots.delete(uuid);
            }
        } catch (error) {
            throw new Error(`Failed to delete bot: ${error}`);
        }
    }

    async startAllBots(): Promise<void> {
        try {
            const bots = Array.from(this.bots.values());
            for (const bot of bots) {
                await this.startBot(bot.uuid);
                await this.cryptoSubscriptionService.startAllSubscriptions(bot.uuid);
            }
        } catch (error) {
            throw new Error(`Failed to start all bots: ${error}`);
        }
    }

    async stopAllBots(): Promise<void> {
        try {
            const bots = Array.from(this.bots.values());
            for (const bot of bots) {
                await this.stopBot(bot.uuid);
                await this.cryptoSubscriptionService.stopAllSubscriptions(bot.uuid);
            }
        } catch (error) {
            throw new Error(`Failed to stop all bots: ${error}`);
        }
    }

    async getBotsWithSubscriptions(): Promise<any[]> {
        return Array.from(this.bots.values()).map((bot: BotModel) => ({
            uuid: bot.uuid,
            symbol: bot.symbol,
            strategy: bot.strategy,
            timeframe: bot.timeframe,
            active: bot.active,
            created_at: bot.created_at,
            subscriptions: Array.from(bot.subscriptions.values())
        }));
    }

}