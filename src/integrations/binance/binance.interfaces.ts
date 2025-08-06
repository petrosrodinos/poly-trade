export interface BinanceAccount {
    id: string;
    status: string;
    buying_power: string;
    cash: string;
    portfolio_value: string;
    balances: BinanceBalance[];
}

export interface BinanceBalance {
    asset: string;
    free: string;
    locked: string;
}

export interface BinancePosition {
    symbol: string;
    positionAmt: string;
    entryPrice: string;
    markPrice: string;
    unRealizedProfit: string;
    positionSide: string;
}

export interface BinanceOrderResponse {
    symbol: string;
    orderId: number;
    clientOrderId: string;
    transactTime: number;
    price: string;
    origQty: string;
    executedQty: string;
    status: string;
    timeInForce: string;
    type: string;
    side: string;
}

export interface BinanceCandlestick {
    symbol: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    trades: number;
    interval: string;
    timestamp: string;
    closeTime: string;
    isKlineClosed: boolean;
}

export type BinanceOrderSide = 'BUY' | 'SELL';
export type BinanceOrderType = 'MARKET' | 'LIMIT';
