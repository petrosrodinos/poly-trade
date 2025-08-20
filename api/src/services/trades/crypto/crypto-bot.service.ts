import { logger } from "../../../shared/utils/logger";
import { BotModel } from "../models/bot.model";
import { CryptoSubscriptionService } from "./crypto-subscription.service";
import { UserBotSubscriptions } from "@/modules/bots/interfaces/bot.interface";

export class CryptoBotService {

    public bots: Map<string, BotModel> = new Map();
    private cryptoSubscriptionService: CryptoSubscriptionService;

    constructor() {
        this.cryptoSubscriptionService = new CryptoSubscriptionService(this);
    }

    async createBot(bot: UserBotSubscriptions): Promise<BotModel | null> {
        try {

            const existingBot = Array.from(this.bots.values()).find((b: BotModel) => bot.uuid === b.uuid);

            if (!existingBot) {
                let newBot = new BotModel({
                    uuid: bot.uuid,
                    symbol: bot.symbol,
                    timeframe: bot.timeframe,
                    strategy: bot.strategy,
                    active: bot.active,
                    subscriptions: new Map(),
                });

                this.bots.set(newBot.uuid, newBot);

                if (bot?.subscriptions?.length > 0) {
                    for (const subscription of bot.subscriptions) {
                        this.cryptoSubscriptionService.createSubscription(newBot, subscription);
                    }
                }

                logger.success(`Bot created for ${newBot.symbol}, ID: ${newBot.uuid}`);

                return newBot;
            } else {
                console.log('bot already exists', existingBot);
            }

            return existingBot;

        } catch (error) {
            logger.error(`Error creating bot: ${error}`);
            return null;
        }
    }

    async startBot(bot_uuid: string): Promise<void> {
        try {

            const bot = this.bots.get(bot_uuid) || null;
            if (bot) {
                bot.active = true;
                this.bots.set(bot_uuid, new BotModel(bot));
                // await this.cryptoSubscriptionService.startAllSubscriptions(bot_uuid);
            }

        } catch (error) {
            console.error(`Error starting bot for ${bot_uuid}:`, error);
        }
    }



    async stopBot(bot_uuid: string): Promise<void> {
        try {
            const bot = this.bots.get(bot_uuid) || null;

            if (bot) {
                bot.active = false;
                this.bots.set(bot_uuid, new BotModel(bot));
                // await this.cryptoSubscriptionService.stopAllSubscriptions(bot_uuid);
            }

        } catch (error) {
            logger.error(`Error stopping bot: ${bot_uuid}:`, error);
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

    async startAllBots(db_bots: UserBotSubscriptions[]): Promise<void> {
        try {
            const bots = Array.from(this.bots.values());

            if (bots.length === 0) {
                for (const bot of db_bots) {
                    await this.createBot(bot);
                }

                const createdBots = Array.from(this.bots.values());
                for (const bot of createdBots) {
                    await this.startBot(bot.uuid);
                }
            } else {
                for (const bot of bots) {
                    await this.startBot(bot.uuid);
                }
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
            }
        } catch (error) {
            throw new Error(`Failed to stop all bots: ${error}`);
        }
    }

    async getBotByUuid(uuid: string): Promise<BotModel | null> {
        return this.bots.get(uuid) || null;
    }

    async getBotsWithSubscriptions(): Promise<any[]> {
        console.log('getting bots with subscriptions', this.bots.size);
        return Array.from(this.bots.values()).map((bot: BotModel) => ({
            uuid: bot.uuid,
            symbol: bot.symbol,
            strategy: bot.strategy,
            timeframe: bot.timeframe,
            active: bot.active,
            createdAt: bot.createdAt,
            subscriptions: Array.from(bot.subscriptions.values())
        }));
    }

}