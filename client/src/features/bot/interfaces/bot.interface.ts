import type { FuturesTrade } from "@/features/account/interfaces/account.interfaces";

export interface Bot {
    id: string;
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
}
