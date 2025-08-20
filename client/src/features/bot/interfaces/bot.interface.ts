
export interface Bot {
    id: number;
    uuid: string;
    strategy: string;
    active: boolean;
    visible: boolean;
    symbol: string;
    timeframe: string;
    created_at: string;
}

export interface BotFormData {
    symbol: string;
    timeframe: string;
    active: boolean;
    visible: boolean;
    strategy?: string;
}

export interface UpdateBotFormData {
    uuid: string;
    symbol?: string;
    timeframe?: string;
    active?: boolean;
    visible?: boolean;
    strategy?: string;
}

export interface BotQuery {
    active?: boolean;
    visible?: boolean;
}


