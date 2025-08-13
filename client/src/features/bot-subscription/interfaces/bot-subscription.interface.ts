
export interface BotSubscription {
    id: string;
    uuid: string;
    bot_id: string;
    amount: number;
    leverage: number;
    active: boolean;
    created_at: string;
}

export interface BotSubscriptionFormData {
    bot_id: string;
    amount: number;
    leverage: number;
    active: boolean;
}