import { BotSubscription, User as PrismaUser } from '@prisma/client';

export interface User extends PrismaUser {
    balance?: number;
    commission?: number;
    profit?: number;
    commission_paid?: number;
    subscriptions: BotSubscription[];
    meta: Record<string, any>;
}