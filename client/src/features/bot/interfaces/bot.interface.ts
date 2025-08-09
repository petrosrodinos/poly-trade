export interface Bot {
    id: string;
    active: boolean;
    symbol: string;
    interval: string;
    amount: number;
    leverage: number;
    created_at: string;
    quantity?: number;
}

export interface BotFormData {
    symbol: string;
    amount: number;
    interval: string;
    leverage: number;
}