import type { FuturesTrade } from "@/features/account/interfaces/account.interfaces";
import type { Bot } from "@/features/bot/interfaces/bot.interface";

export interface BotSubscription {
    id: string;
    uuid: string;
    user_uuid: string;
    bot_uuid: string;
    amount: number;
    leverage: number;
    active: boolean;
    profit?: number;
    trades?: FuturesTrade[];
    createdAt: string;
    bot?: Bot;
}

export interface BotSubscriptionUpdateFormData {
    uuid: string;
    amount?: number;
    leverage?: number;
    active?: boolean;
}

export interface BotSubscriptionFormData {
    bot_uuid: string;
    amount: number;
    leverage: number;
    active: boolean;
}