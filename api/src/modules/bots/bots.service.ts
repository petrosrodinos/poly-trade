import { v4 as uuidv4 } from 'uuid';
import prisma from '../../core/prisma/prisma-client';
import { CreateBotDto, UpdateBotDto, BotQueryDto, BotResponse } from './dto/bot.dto';

export class BotsService {
    private prisma: any;

    constructor() {
        this.prisma = prisma;
    }

    async createBot(data: CreateBotDto, user_id: number): Promise<BotResponse> {
        const bot = await this.prisma.bot.create({
            data: {
                uuid: uuidv4(),
                symbol: data.symbol,
                timeframe: data.timeframe,
                active: data.active ?? true,
                user_id: user_id
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

    async getBotByUuid(uuid: string, user_id: number): Promise<BotResponse | null> {
        return await this.prisma.bot.findFirst({
            where: {
                uuid: uuid,
                user_id: user_id
            }
        });
    }

    async updateBot(uuid: string, data: UpdateBotDto, user_id: number): Promise<BotResponse | null> {
        const existingBot = await this.getBotByUuid(uuid, user_id);

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
    }

    async deleteBot(uuid: string, user_id: number): Promise<boolean> {
        const existingBot = await this.getBotByUuid(uuid, user_id);

        if (!existingBot) {
            return false;
        }

        await this.prisma.bot.delete({
            where: {
                uuid: uuid
            }
        });

        return true;
    }


}
