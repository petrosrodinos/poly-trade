import { v4 as uuidv4 } from 'uuid';
import prisma from '../../core/prisma/prisma-client';
import { CreateBotDto, UpdateBotDto, BotQueryDto } from './dto/bot.dto';
import { Bot, UserBotSubscriptions } from './interfaces/bot.interface';
import CryptoBotSingleton from '../../services/trades/models/crypto-bot-singleton.service';
import { CryptoBotService } from '../../services/trades/crypto/crypto-bot.service';
import { BinanceTradesService } from '../../integrations/binance/services/binance-trades.service';
import { BotModel } from '../../services/trades/models/bot.model';

export class BotsService {
    private prisma: any;
    private cryptoBotService: CryptoBotService;
    private binanceTradesService: BinanceTradesService;

    constructor() {
        this.prisma = prisma;
        this.cryptoBotService = CryptoBotSingleton.getInstance();
        this.binanceTradesService = new BinanceTradesService();
    }

    async createBot(data: CreateBotDto, user_uuid: string): Promise<BotModel> {
        try {
            const bot = await this.prisma.bot.create({
                data: {
                    uuid: uuidv4(),
                    symbol: data.symbol,
                    timeframe: data.timeframe,
                    active: data.active,
                    strategy: data.strategy ?? 'default',
                    user_uuid: user_uuid,
                    visible: data.visible
                }
            });

            await this.cryptoBotService.createBot(bot);

            return bot;
        } catch (error) {
            throw error;
        }
    }

    async getAllBots(query: BotQueryDto): Promise<BotModel> {
        try {
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

            if (query.visible !== undefined) {
                where.visible = query.visible;
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
                })
            ]);


            return bots;
        } catch (error) {
            throw error;
        }
    }

    async getBotByUuid(uuid: string): Promise<BotModel | null> {
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

    async updateBot(uuid: string, data: UpdateBotDto, user_uuid: string): Promise<BotModel | null> {
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

                await this.cryptoBotService.updateBot(uuid, data);

                if (data.active) {
                    await this.cryptoBotService.startBot(uuid);
                } else {
                    await this.cryptoBotService.stopBot(uuid);
                    // await this.binanceTradesService.closeAllPositions([existingBot.symbol]);
                }

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

            // await this.binanceTradesService.closeAllPositions([existingBot.symbol]);


            return true;
        } catch (error) {
            return false;
        }
    }

    async stopAllBots(): Promise<UserBotSubscriptions[]> {
        try {

            const result = await this.startOrStopBots(false);

            await this.cryptoBotService.stopAllBots();

            // await this.binanceTradesService.closeAllPositions(result.map((bot: Bot) => bot.symbol));

            return result;

        } catch (error) {
            console.error('Error stopping all bots', error);
            return [];
        }
    }

    async startAllBots(): Promise<UserBotSubscriptions[]> {

        try {
            const result = await this.startOrStopBots(true);

            await this.cryptoBotService.startAllBots(result);

            return result;
        } catch (error) {
            console.error('Error starting all bots', error);
            return [];
        }
    }


    async startOrStopBots(active: boolean): Promise<UserBotSubscriptions[]> {
        try {
            const bots = await this.prisma.bot.findMany({
                where: {
                    active: !active
                },
                include: {
                    subscriptions: {
                        select: {
                            uuid: true,
                            bot_uuid: true,
                            user_uuid: true,
                            amount: true,
                            quantity: true,
                            leverage: true,
                            active: true,
                            createdAt: true,
                        }
                    }
                }
            });

            if (bots.length === 0) {
                return [];
            }

            await this.prisma.bot.updateMany({
                where: {
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

            return bots;
        } catch (error) {
            return [];
        }
    }

    async getInternalBots(): Promise<any[]> {
        return await this.cryptoBotService.getBotsWithSubscriptions();
    }


}

export const botService = new BotsService();
