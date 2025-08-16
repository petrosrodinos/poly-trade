import { v4 as uuidv4 } from 'uuid';
import prisma from '../../core/prisma/prisma-client';
import {
    CreateBotSubscriptionDto,
    UpdateBotSubscriptionDto,
    BotSubscriptionQueryDto,
    BotSubscriptionResponse,
    PaginatedBotSubscriptionsResponse
} from './dto/bot-subscription.dto';
import { BinanceAccountService } from '../../integrations/binance/services/binance-account.service';
import { CryptoSubscriptionService } from '../../services/trades/crypto/crypto-subscription.service';
import { CryptoBotService } from '../../services/trades/crypto/crypto-bot.service';
import CryptoBotSingleton from '../../services/trades/models/crypto-bot-singleton.service';
import { TradesUtils } from '../../integrations/binance/utils/trades.utils';
import { BinanceTradesService } from '../../integrations/binance/services/binance-trades.service';

export class BotSubscriptionsService {
    private prisma: any;
    private binanceAccountService: BinanceAccountService;
    private binanceTradesService: BinanceTradesService;
    private tradesUtils: TradesUtils;
    private cryptoSubscriptionService: CryptoSubscriptionService;
    private cryptoBotService: CryptoBotService;

    constructor() {
        this.prisma = prisma;
        this.binanceAccountService = new BinanceAccountService();
        this.binanceTradesService = new BinanceTradesService();
        this.tradesUtils = new TradesUtils();
        this.cryptoBotService = CryptoBotSingleton.getInstance();
        this.cryptoSubscriptionService = new CryptoSubscriptionService(this.cryptoBotService);
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

            const balance = await this.binanceAccountService.getAccountBalance("USDT");

            if (balance < data.amount) {
                throw new Error('Insufficient balance to create bot');
            }

            const { quantity, minQty, price } = await this.tradesUtils.getTradeQuantity(botExists.symbol, data.amount);

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

            // await this.cryptoBotService.createBot(botExists);

            await this.cryptoSubscriptionService.createSubscription(botExists, subscription);

            return subscription;
        } catch (error: any) {
            console.error('Error creating bot subscription', error);
            throw new Error(error.message);
        }
    }

    async getAllBotSubscriptions(query: BotSubscriptionQueryDto, user_uuid: string): Promise<PaginatedBotSubscriptionsResponse> {
        try {
            const where: any = {};

            where.user_uuid = user_uuid;

            if (query.bot_uuid) {
                where.bot_uuid = query.bot_uuid;
            }

            if (query.active !== undefined) {
                where.active = query.active;
            }

            const [subscriptions] = await Promise.all([
                this.prisma.botSubscription.findMany({
                    where,
                    include: {
                        bot: {
                            select: {
                                id: true,
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
                    // await this.binanceTradesService.closePosition(existingSubscription.bot.symbol);
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

            await this.prisma.botSubscription.delete({
                where: { uuid }
            });

            await this.cryptoSubscriptionService.deleteSubscription(existingSubscription.bot_uuid, existingSubscription);

            // await this.binanceTradesService.closePosition(existingSubscription.bot.symbol);

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
            }

            // TODO: Start all user subscriptions

            return true;
        } catch (error) {
            console.error('Error starting all bot subscriptions', error);
            throw new Error('Failed to start all bot subscriptions');
        }

    }

    async stopAllBotSubscriptions(user_uuid: string): Promise<boolean> {
        try {
            const subscriptions = await this.prisma.botSubscription.findMany({
                where: { user_uuid }
            });

            if (subscriptions.length > 0) {
                await this.prisma.botSubscription.updateMany({
                    where: { user_uuid },
                    data: { active: false }
                });
            }

            // TODO: Stop all user subscriptions

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


            const { trades, profit } = await this.binanceAccountService.getFuturesUserTradesAndProfit(subscription.bot.symbol);

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
