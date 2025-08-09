export interface Bot {
    id: string;
    active: boolean;
    symbol: string;
    created_at: string;
    interval: string;
    amount: number;
    quantity: number;
    profit: number;
    leverage?: number;
}

export interface BotFormData {
    symbol: string;
    amount: number;
    interval: string;
    leverage: number;
}