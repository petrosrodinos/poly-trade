export interface Bot {
    id: number;
    uuid: string;
    symbol: string;
    timeframe: string;
    strategy: string;
    active: boolean;
    visible: boolean;
    user_uuid: string;
    createdAt: string;
    updatedAt: string;
}


export interface PaginatedBots {
    bots: Bot[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export interface UserBotSubscriptions extends Bot {
    subscriptions: Subscription[];
}



export interface Subscription {
    uuid: string;
    bot_uuid: string;
    amount: number;
    leverage: number;
    quantity: number;
    user_uuid: string;
    createdAt: string;
    active: boolean;
}
