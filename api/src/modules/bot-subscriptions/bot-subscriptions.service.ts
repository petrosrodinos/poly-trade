import { v4 as uuidv4 } from 'uuid';
import prisma from '../../core/prisma/prisma-client';
import {
    CreateBotSubscriptionDto,
    UpdateBotSubscriptionDto,
    BotSubscriptionQueryDto,
    BotSubscriptionResponse,
    PaginatedBotSubscriptionsResponse
} from './dto/bot-subscription.dto';
import { CryptoSubscriptionService } from '../../services/trades/crypto/crypto-subscription.service';
import { CryptoBotService } from '../../services/trades/crypto/crypto-bot.service';
import CryptoBotSingleton from '../../services/trades/models/crypto-bot-singleton.service';
import { BrokersFuturesTradesService } from '../../integrations/brokers/futures/services/brokers-trades.services';
import { BrokerFuturesTradesUtils } from '../../integrations/brokers/futures/utils/broker-trades.utils';
import { Exchanges } from '../../integrations/brokers/futures/interfaces/brokers-account.interfaces';
import { BrokersFuturesAccountService } from '../../integrations/brokers/futures/services/brokers-account.services';

export class BotSubscriptionsService {
    private prisma: any;
    private cryptoSubscriptionService: CryptoSubscriptionService;
    private cryptoBotService: CryptoBotService;
    private brokersFuturesTradesService: BrokersFuturesTradesService;
    private brokersTradesUtils: BrokerFuturesTradesUtils;
    private brokersFuturesAccountService: BrokersFuturesAccountService;

    constructor() {
        this.prisma = prisma;
        this.cryptoBotService = CryptoBotSingleton.getInstance();
        this.cryptoSubscriptionService = new CryptoSubscriptionService(this.cryptoBotService);
        this.brokersFuturesTradesService = new BrokersFuturesTradesService();
        this.brokersFuturesAccountService = new BrokersFuturesAccountService();
        this.brokersTradesUtils = new BrokerFuturesTradesUtils();
    }

    async createBotSubscription(data: CreateBotSubscriptionDto, user_uuid: string): Promise<BotSubscriptionResponse> {

        try {
            const botExists = await this.prisma.bot.findFirst({
                where: { uuid: data.bot_uuid }
            });

            if (!botExists) {
                throw new Error('Bot not found');
            }

            const existingSubscription = await this.prisma.botSubscription.findFirst({
                where: {
                    user_uuid: user_uuid,
                    bot_uuid: data.bot_uuid
                }
            });

            if (existingSubscription) {
                throw new Error('User already subscribed to this bot');
            }

            const balance = await this.brokersFuturesAccountService.getAccountBalance(user_uuid, Exchanges.DEFAULT);

            if (balance < data.amount) {
                throw new Error('Insufficient balance to create bot');
            }

            const { quantity, minQty, price } = await this.brokersTradesUtils.getTradeQuantity(user_uuid, Exchanges.DEFAULT, botExists.symbol, data.amount);

            if (quantity === 0) {
                throw new Error(`Minimum amount required is ${minQty * (price || 0)} USDT`);
            }

            const subscription = await this.prisma.botSubscription.create({
                data: {
                    uuid: uuidv4(),
                    user_uuid: user_uuid,
                    bot_uuid: data.bot_uuid,
                    amount: data.amount,
                    leverage: data.leverage,
                    active: data.active ?? false,
                    quantity: quantity,
                }
            });

            await this.cryptoSubscriptionService.createSubscription(botExists, subscription);

            return subscription;
        } catch (error: any) {
            console.error('Error creating bot subscription', error);
            throw new Error(error.message);
        }
    }

    async getUserBotSubscriptions(user_uuid: string): Promise<BotSubscriptionResponse[]> {
        try {
            const subscriptions = await this.prisma.botSubscription.findMany({
                where: { user_uuid },
                include: {
                    bot: {
                        select: {
                            symbol: true
                        }
                    }
                }
            });

            return subscriptions;
        }
        catch (error) {
            console.error('Error getting bot subscriptions', error);
            throw new Error('Failed to get bot subscriptions');
        }
    }

    async getAllBotSubscriptions(query: BotSubscriptionQueryDto, user_uuid: string): Promise<PaginatedBotSubscriptionsResponse> {
        try {
            const where: any = {};

            where.user_uuid = user_uuid;

            if (query.active !== undefined) {
                where.active = query.active;
            }

            const [subscriptions] = await Promise.all([
                this.prisma.botSubscription.findMany({
                    where,
                    include: {
                        bot: {
                            select: {
                                uuid: true,
                                symbol: true,
                                timeframe: true,
                                active: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }),
            ]);

            return subscriptions
        } catch (error) {
            console.error('Error getting all bot subscriptions', error);
            throw new Error('Failed to get all bot subscriptions');
        }
    }


    async updateBotSubscription(uuid: string, data: UpdateBotSubscriptionDto, user_uuid: string): Promise<BotSubscriptionResponse> {

        try {
            const existingSubscription = await this.prisma.botSubscription.findFirst({
                where: {
                    uuid,
                    user_uuid
                },
                include: {
                    bot: {
                        select: {
                            symbol: true
                        }
                    }
                }
            });

            if (!existingSubscription) {
                throw new Error('Bot subscription not found');
            }

            const subscription = await this.prisma.botSubscription.update({
                where: { uuid },
                data: {
                    ...data,
                },
            });

            await this.cryptoSubscriptionService.updateSubscription(existingSubscription.bot_uuid, subscription);

            if (data.active !== existingSubscription.active) {
                if (!data.active) {
                    await this.brokersFuturesTradesService.closePosition(user_uuid, Exchanges.DEFAULT, existingSubscription.bot.symbol);
                }

            }

            return subscription;
        } catch (error) {
            console.error('Error updating bot subscription', error);
            throw new Error('Failed to update bot subscription');
        }
    }

    async deleteBotSubscription(uuid: string, user_uuid: string): Promise<boolean> {

        try {

            let existingSubscription: any;

            try {
                existingSubscription = await this.prisma.botSubscription.findFirst({
                    where: {
                        uuid,
                        user_uuid
                    },
                    include: {
                        bot: {
                            select: {
                                symbol: true
                            }
                        }
                    }
                });

                if (!existingSubscription) {
                    throw new Error('Bot subscription not found');
                }

                await this.prisma.botSubscription.delete({
                    where: { uuid }
                });

            } catch (error) {
                console.error('Error deleting bot subscription', error);
            }

            try {
                await this.brokersFuturesTradesService.closePosition(user_uuid, Exchanges.DEFAULT, existingSubscription.bot.symbol);
            } catch (error) {
                console.error('Error closing position', error);
            }

            await this.cryptoSubscriptionService.deleteSubscription(existingSubscription.bot_uuid, existingSubscription);

            return true;
        } catch (error) {
            console.error('Error deleting bot subscription', error);
            throw new Error('Failed to delete bot subscription');
        }
    }

    async startAllBotSubscriptions(user_uuid: string): Promise<boolean> {
        try {
            const subscriptions = await this.prisma.botSubscription.findMany({
                where: { user_uuid }
            });

            if (subscriptions.length > 0) {
                await this.prisma.botSubscription.updateMany({
                    where: { user_uuid },
                    data: { active: true }
                });

                await this.cryptoSubscriptionService.startAllSubscriptionsByUser(user_uuid);
            }


            return true;
        } catch (error) {
            console.error('Error starting all bot subscriptions', error);
            throw new Error('Failed to start all bot subscriptions');
        }

    }

    async stopAllBotSubscriptions(user_uuid: string): Promise<boolean> {
        try {
            const subscriptions = await this.prisma.botSubscription.findMany({
                where: { user_uuid },
                include: {
                    bot: {
                        select: {
                            symbol: true
                        }
                    }
                }
            });

            if (subscriptions.length > 0) {
                await this.prisma.botSubscription.updateMany({
                    where: { user_uuid },
                    data: { active: false }
                });

                await this.cryptoSubscriptionService.stopAllSubscriptionsByUser(user_uuid);

                await this.brokersFuturesTradesService.closeAllPositionsForUser(user_uuid, Exchanges.DEFAULT, subscriptions.map((subscription: any) => subscription.bot.symbol));
            }


            return true;
        } catch (error) {
            console.error('Error stopping all bot subscriptions', error);
            throw new Error('Failed to stop all bot subscriptions');
        }

    }


    async getBotSubscriptionByBotUuid(bot_uuid: string, user_uuid: string): Promise<BotSubscriptionResponse> {
        try {
            const subscription = await this.prisma.botSubscription.findFirst({
                where: {
                    bot_uuid,
                    user_uuid
                },
                include: {
                    bot: {
                        select: {
                            symbol: true
                        }
                    }
                }
            });

            if (!subscription) {
                throw new Error('Bot subscription not found');
            }


            const { trades, profit } = await this.brokersFuturesAccountService.getFuturesUserTradesAndProfit(user_uuid, Exchanges.DEFAULT, subscription.bot.symbol);

            return {
                ...subscription,
                trades,
                profit
            };
        } catch (error) {
            throw new Error('Bot subscription not found');
        }
    }



}
