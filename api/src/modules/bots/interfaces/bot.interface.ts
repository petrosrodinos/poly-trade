export interface Bot {
    id: number;
    uuid: string;
    symbol: string;
    timeframe: string;
    active: boolean;
    user_id: number;
    createdAt: Date;
    updatedAt: Date;
}


export interface PaginatedBots {
    bots: Bot[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
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
