import { v4 as uuidv4 } from 'uuid';
import prisma from '../../core/prisma/prisma-client';
import { CreateBotDto, UpdateBotDto, BotQueryDto, BotResponse } from './dto/bot.dto';
import { UserBotSubscription } from './interfaces/bot.interface';
import CryptoBotSingleton from '../../services/trades/crypto/crypto-bot-singleton.service';
import { BotModel } from '../../services/trades/models/bot.model';
import { CryptoBotService } from '../../services/trades/crypto/crypto-bot.service';

export class BotsService {
    private prisma: any;
    private cryptoBotService: CryptoBotService;

    constructor() {
        this.prisma = prisma;
        this.cryptoBotService = CryptoBotSingleton.getInstance();
    }

    async createBot(data: CreateBotDto, user_uuid: string): Promise<BotResponse> {
        try {
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

            await this.cryptoBotService.createBot(bot);

            return bot;
        } catch (error) {
            throw error;
        }
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

            if (existingBot.active !== data.active) {
                const [, updatedBot] = await Promise.all([
                    this.prisma.botSubscription.updateMany({
                        where: {
                            bot_uuid: uuid,
                            active: !data.active
                        },
                        data: {
                            active: data.active
                        }
                    }),
                    this.prisma.bot.update({
                        where: {
                            uuid: uuid
                        },
                        data: {
                            ...data,
                        }
                    })
                ]);

                if (data.active) {
                    await this.cryptoBotService.startBot(uuid);
                } else {
                    await this.cryptoBotService.stopBot(uuid);
                }

                await this.cryptoBotService.updateBot(uuid, data);

                return updatedBot;

            } else {
                const updatedBot = await this.prisma.bot.update({
                    where: {
                        uuid: uuid
                    },
                    data: {
                        ...data,
                    }
                });

                return updatedBot;
            }



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

            await this.cryptoBotService.deleteBot(uuid);

            return true;
        } catch (error) {
            return false;
        }
    }

    async stopAllBots(user_uuid: string): Promise<boolean> {
        try {

            const result = await this.startOrStopBots(user_uuid, false);

            await this.cryptoBotService.stopAllBots();

            return result;

        } catch (error) {
            return false;
        }
    }

    async startAllBots(user_uuid: string): Promise<boolean> {

        try {
            const result = await this.startOrStopBots(user_uuid, true);

            await this.cryptoBotService.startAllBots();

            return result;
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

    async startOrStopBots(user_uuid: string, active: boolean): Promise<boolean> {
        try {
            const bots = await this.prisma.bot.findMany({
                where: {
                    user_uuid: user_uuid,
                    active: !active
                }
            });

            if (bots.length === 0) {
                return false;
            }

            await this.prisma.bot.updateMany({
                where: {
                    user_uuid: user_uuid,
                    active: !active
                },
                data: {
                    active: active
                }
            })

            await Promise.all(
                bots.map((bot: { uuid: string; }) =>
                    this.prisma.botSubscription.updateMany({
                        where: {
                            bot_uuid: bot.uuid,
                            active: !active
                        },
                        data: {
                            active: active
                        }
                    })
                )
            );

            return true;
        } catch (error) {
            return false;
        }
    }

    async getInternalBots(): Promise<any[]> {
        return await this.cryptoBotService.getBotsWithSubscriptions();
    }


}
