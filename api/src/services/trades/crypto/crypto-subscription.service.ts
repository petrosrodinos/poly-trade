import { logger } from "../../../shared/utils/logger";
import { BotModel, BotSubscriptionModel } from "../models/bot.model";
import { CryptoBotService } from "./crypto-bot.service";

export class CryptoSubscriptionService {
    private cryptoBotService: CryptoBotService;

    constructor(cryptoBotService: CryptoBotService) {
        this.cryptoBotService = cryptoBotService;
    }

    async createSubscription(bot: BotModel, subscription: BotSubscriptionModel): Promise<BotModel> {
        try {

            const existingBot = this.cryptoBotService.bots.get(bot.uuid);
            if (existingBot) {
                existingBot.subscriptions.set(subscription.uuid, new BotSubscriptionModel(subscription));
                this.cryptoBotService.bots.set(bot.uuid, new BotModel(existingBot));
                logger.success(`Subscription created for ${bot.symbol}, ID: ${subscription.uuid}`);

            } else {
                console.log('Bot not found');
            }


            return bot;

        } catch (error) {
            throw error;
        }
    }

    async startSubscription(uuid: string, subscription: BotSubscriptionModel): Promise<void> {
        try {
            const bot = this.cryptoBotService.bots.get(uuid);

            if (bot) {
                const subscriptionExists = bot.subscriptions.get(subscription.uuid);

                if (subscriptionExists) {
                    subscriptionExists.active = true;
                    bot.subscriptions.set(subscription.uuid, subscriptionExists);
                    this.cryptoBotService.bots.set(bot.uuid, new BotModel(bot));

                    logger.success(`Subscription started for ${bot.symbol}, ID: ${subscription.uuid}`);
                }
            }
        } catch (error) {
            console.error(`Error starting subscription for ${uuid}:`, error);
            throw error;
        }
    }



    async stopSubscription(bot_uuid: string, subscription: BotSubscriptionModel): Promise<void> {
        try {
            const bot = this.cryptoBotService.bots.get(bot_uuid);
            if (bot) {
                const subscriptionExists = bot.subscriptions.get(subscription.uuid);
                if (subscriptionExists) {
                    subscriptionExists.active = false;
                    bot.subscriptions.set(subscription.uuid, subscriptionExists);
                    this.cryptoBotService.bots.set(bot.uuid, new BotModel(bot));

                    logger.success(`Subscription stopped for ${bot.symbol}, ID: ${subscription.uuid}`);
                }
            }
        } catch (error) {
            console.error(`Error stopping subscription for ${bot_uuid}:`, error);
            throw error;
        }
    }


    async updateSubscription(bot_uuid: string, subscription: Partial<BotSubscriptionModel>): Promise<BotSubscriptionModel | null> {
        try {
            const bot = this.cryptoBotService.bots.get(bot_uuid);

            if (bot) {
                const existingSubscription = bot.subscriptions.get(subscription.uuid || '');

                if (existingSubscription) {
                    existingSubscription.active = subscription.active ?? existingSubscription.active;
                    existingSubscription.quantity = subscription.quantity || existingSubscription.quantity;
                    existingSubscription.leverage = subscription.leverage || existingSubscription.leverage;
                    existingSubscription.amount = subscription.amount || existingSubscription.amount;

                    bot.subscriptions.set(existingSubscription.uuid, existingSubscription);
                    this.cryptoBotService.bots.set(bot_uuid, new BotModel(bot));

                    return existingSubscription;
                }
            }

            return null;
        } catch (error) {
            throw new Error(`Failed to update subscription: ${error}`);
        }
    }

    async deleteSubscription(bot_uuid: string, subscription: BotSubscriptionModel): Promise<void> {
        try {
            const bot = this.cryptoBotService.bots.get(bot_uuid);
            if (bot) {
                const subscriptionExists = bot.subscriptions.get(subscription.uuid);
                if (subscriptionExists) {
                    bot.subscriptions.delete(subscription.uuid);
                    this.cryptoBotService.bots.set(bot_uuid, new BotModel(bot));
                    logger.success(`Subscription deleted for ${bot.symbol}, ID: ${subscription.uuid}`);
                }
            }
        } catch (error) {
            throw new Error(`Failed to delete subscription: ${error}`);
        }
    }

    async startAllSubscriptions(bot_uuid: string): Promise<void> {
        try {
            const bot = this.cryptoBotService.bots.get(bot_uuid);
            if (bot) {
                for (const subscription of bot.subscriptions.values()) {
                    if (subscription && !subscription.active) {
                        await this.startSubscription(bot.uuid, subscription);
                    }
                }
            }
        } catch (error) {
            throw new Error(`Failed to start all subscriptions: ${error}`);
        }
    }

    async stopAllSubscriptions(bot_uuid: string): Promise<void> {
        try {
            const bot = this.cryptoBotService.bots.get(bot_uuid);

            if (bot) {
                for (const subscription of bot.subscriptions.values()) {
                    if (subscription && subscription.active) {
                        await this.stopSubscription(bot.uuid, subscription);
                    }
                }
            }
        } catch (error) {
            throw new Error(`Failed to stop all subscriptions: ${error}`);
        }
    }



}