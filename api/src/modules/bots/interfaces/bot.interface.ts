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
