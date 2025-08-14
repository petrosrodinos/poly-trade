import type { FuturesTrade } from "@/features/account/interfaces/account.interfaces";

export interface Bot {
    id: number;
    uuid: string;
    strategy: string;
    active: boolean;
    symbol: string;
    timeframe: string;
    amount: number;
    leverage: number;
    profit?: number;
    trades?: FuturesTrade[];
    quantity?: number;
    created_at: string;
}

export interface BotFormData {
    symbol: string;
    timeframe: string;
    active: boolean;
    strategy?: string;
}

export interface UpdateBotFormData {
    uuid: string;
    symbol?: string;
    timeframe?: string;
    active?: boolean;
    strategy?: string;
}

export interface UserBotSubscription {
    id: number;
    uuid: string;
    symbol: string;
    timeframe: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    bot_subscription?: {
        uuid: string;
        bot_uuid: string;
        amount: number;
        leverage: number;

        active: boolean;
    };
}
