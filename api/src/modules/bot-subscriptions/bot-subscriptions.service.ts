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

export class BotSubscriptionsService {
    private prisma: any;
    private binanceAccountService: BinanceAccountService;

    constructor() {
        this.prisma = prisma;
        this.binanceAccountService = new BinanceAccountService();

    }

    async createBotSubscription(data: CreateBotSubscriptionDto, user_uuid: string): Promise<BotSubscriptionResponse> {
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

        const subscription = await this.prisma.botSubscription.create({
            data: {
                uuid: uuidv4(),
                user_uuid: user_uuid,
                bot_uuid: data.bot_uuid,
                amount: data.amount,
                leverage: data.leverage,
                active: data.active ?? false
            }
        });

        return subscription;
    }

    async getAllBotSubscriptions(query: BotSubscriptionQueryDto, user_uuid: string): Promise<PaginatedBotSubscriptionsResponse> {
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
    }


    async updateBotSubscription(uuid: string, data: UpdateBotSubscriptionDto, user_uuid: string): Promise<BotSubscriptionResponse> {

        const existingSubscription = await this.prisma.botSubscription.findFirst({
            where: {
                uuid,
                user_uuid
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
            }
        });

        return subscription;
    }

    async deleteBotSubscription(uuid: string, user_uuid: string): Promise<boolean> {

        const existingSubscription = await this.prisma.botSubscription.findFirst({
            where: {
                uuid,
                user_uuid
            }
        });

        if (!existingSubscription) {
            throw new Error('Bot subscription not found');
        }

        await this.prisma.botSubscription.delete({
            where: { uuid }
        });

        return true;
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
