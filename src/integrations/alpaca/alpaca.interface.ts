export type AlpacaStreamingType = 'stocks' | 'crypto' | 'test';

export interface AlpacaPosition {
    symbol: string;
    qty: string;
    side: 'long' | 'short';
    market_value: string;
    cost_basis: string;
    unrealized_pl: string;
}

export interface AlpacaAccount {
    id: string;
    account_number: string;
    status: string;
    currency: string;
    buying_power: string;
    cash: string;
    portfolio_value: string;
}

export interface TradeError extends Error {
    code?: number;
    symbol?: string;
    side?: string;
    qty?: number;
}