import { v4 as uuidv4 } from 'uuid';
import prisma from '../../core/prisma/prisma-client';
import { CreateBotDto, UpdateBotDto, BotQueryDto, BotResponse } from './dto/bot.dto';
import { BotSubscriptionResponse } from '../bot-subscriptions/dto/bot-subscription.dto';
import { UserBotSubscription } from './interfaces/bot.interface';

export class BotsService {
    private prisma: any;

    constructor() {
        this.prisma = prisma;
    }

    async createBot(data: CreateBotDto, user_uuid: string): Promise<BotResponse> {
        const bot = await this.prisma.bot.create({
            data: {
                uuid: uuidv4(),
                symbol: data.symbol,
                timeframe: data.timeframe,
                active: data.active ?? true,
                strategy: data.strategy ?? 'default',
                user_uuid: user_uuid
            }
        });

        return bot;
    }

    async getAllBots(query: BotQueryDto): Promise<BotResponse> {
        const where: any = {};

        if (query.symbol) {
            where.symbol = {
                contains: query.symbol,
                mode: 'insensitive'
            };
        }

        if (query.active !== undefined) {
            where.active = query.active;
        }

        if (query.timeframe) {
            where.timeframe = query.timeframe;
        }


        const [bots] = await Promise.all([
            this.prisma.bot.findMany({
                where,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            this.prisma.bot.count({ where })
        ]);


        return bots;
    }

    async getBotByUuid(uuid: string): Promise<BotResponse | null> {
        try {
            return await this.prisma.bot.findFirst({
                where: {
                    uuid: uuid,
                }
            });
        } catch (error) {
            return null;
        }
    }

    async updateBot(uuid: string, data: UpdateBotDto, user_uuid: string): Promise<BotResponse | null> {
        try {
            const existingBot = await this.prisma.bot.findFirst({
                where: {
                    uuid: uuid,
                    user_uuid: user_uuid
                }
            });

            if (!existingBot) {
                return null;
            }

            const updatedBot = await this.prisma.bot.update({
                where: {
                    uuid: uuid
                },
                data: {
                    ...data,
                }
            });

            return updatedBot;
        } catch (error) {
            return null;
        }
    }

    async deleteBot(uuid: string, user_uuid: string): Promise<boolean> {
        try {
            const existingBot = await this.prisma.bot.findFirst({
                where: {
                    uuid: uuid,
                    user_uuid: user_uuid
                }
            });

            if (!existingBot) {
                return false;
            }

            await this.prisma.bot.delete({
                where: {
                    uuid: uuid
                }
            });

            return true;
        } catch (error) {
            return false;
        }
    }


    async getBotSubscriptionForUser(uuid: string, user_uuid: string): Promise<UserBotSubscription | null> {

        const bot = await this.prisma.bot.findFirst({
            where: {
                uuid: uuid,
            },
            include: {
                subscriptions: {
                    select: {
                        uuid: true,
                        bot_uuid: true,
                        amount: true,
                        leverage: true,
                        active: true,
                        createdAt: true,
                    },
                    where: {
                        user_uuid: user_uuid
                    },
                    take: 1
                }
            }
        });

        if (!bot) {
            throw new Error('Bot subscription not found');
        }

        const subscription = bot.subscriptions[0] || null;

        return {
            id: bot.id,
            uuid: bot.uuid,
            symbol: bot.symbol,
            timeframe: bot.timeframe,
            active: bot.active,
            createdAt: bot.createdAt,
            updatedAt: bot.updatedAt,
            bot_subscription: subscription ? {
                uuid: subscription.uuid,
                bot_uuid: subscription.bot_uuid,
                amount: subscription.amount,
                leverage: subscription.leverage,
                active: subscription.active
            } : undefined
        };
    }


}
