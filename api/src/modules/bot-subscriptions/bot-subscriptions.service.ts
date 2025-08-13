import { v4 as uuidv4 } from 'uuid';
import prisma from '../../core/prisma/prisma-client';
import {
    CreateBotSubscriptionDto,
    UpdateBotSubscriptionDto,
    BotSubscriptionQueryDto,
    BotSubscriptionResponse,
    PaginatedBotSubscriptionsResponse
} from './dto/bot-subscription.dto';

export class BotSubscriptionsService {
    private prisma: any;

    constructor() {
        this.prisma = prisma;
    }

    async createBotSubscription(data: CreateBotSubscriptionDto, user_id: number): Promise<BotSubscriptionResponse> {
        const botExists = await this.prisma.bot.findFirst({
            where: { id: data.bot_id }
        });

        if (!botExists) {
            throw new Error('Bot not found');
        }

        const existingSubscription = await this.prisma.botSubscription.findFirst({
            where: {
                user_id: user_id,
                bot_id: data.bot_id
            }
        });

        if (existingSubscription) {
            throw new Error('User already subscribed to this bot');
        }

        const subscription = await this.prisma.botSubscription.create({
            data: {
                uuid: uuidv4(),
                user_id: user_id,
                bot_id: data.bot_id,
                amount: data.amount,
                leverage: data.leverage,
                active: data.active ?? false
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

    async getAllBotSubscriptions(query: BotSubscriptionQueryDto, user_id?: number): Promise<PaginatedBotSubscriptionsResponse> {
        const where: any = {};

        if (user_id) {
            where.user_id = user_id;
        }

        if (query.bot_id) {
            where.bot_id = query.bot_id;
        }

        if (query.active !== undefined) {
            where.active = query.active;
        }

        if (query.user_id) {
            where.user_id = query.user_id;
        }

        const skip = (query.page - 1) * query.limit;

        const [subscriptions, total] = await Promise.all([
            this.prisma.botSubscription.findMany({
                where,
                skip,
                take: query.limit,
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
            this.prisma.botSubscription.count({ where })
        ]);

        const total_pages = Math.ceil(total / query.limit);

        return {
            bot_subscriptions: subscriptions,
            total,
            page: query.page,
            limit: query.limit,
            total_pages
        };
    }


    async updateBotSubscription(uuid: string, data: UpdateBotSubscriptionDto, user_id?: number): Promise<BotSubscriptionResponse> {
        const where: any = { uuid };

        if (user_id) {
            where.user_id = user_id;
        }

        const existingSubscription = await this.prisma.botSubscription.findFirst({ where });

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

    async deleteBotSubscription(uuid: string, user_id?: number): Promise<boolean> {
        const where: any = { uuid };

        if (user_id) {
            where.user_id = user_id;
        }

        const existingSubscription = await this.prisma.botSubscription.findFirst({ where });

        if (!existingSubscription) {
            throw new Error('Bot subscription not found');
        }

        await this.prisma.botSubscription.delete({
            where: { uuid }
        });

        return true;
    }

    async getBotSubscriptionByUuid(uuid: string, user_id?: number): Promise<BotSubscriptionResponse> {
        const where: any = { uuid };

        if (user_id) {
            where.user_id = user_id;
        }

        const subscription = await this.prisma.botSubscription.findFirst({
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
            }
        });

        if (!subscription) {
            throw new Error('Bot subscription not found');
        }

        return subscription;
    }
}
