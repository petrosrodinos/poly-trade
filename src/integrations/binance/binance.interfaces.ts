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
    timestamp: number;
    closeTime: number;
    isKlineClosed: boolean;
}

export interface FuturesAsset {
    asset: string;
    walletBalance: string;
    unrealizedProfit: string;
    marginBalance: string;
    maintMargin: string;
    initialMargin: string;
    positionInitialMargin: string;
    openOrderInitialMargin: string;
    crossWalletBalance: string;
    crossUnPnl: string;
    availableBalance: string;
    maxWithdrawAmount: string;
    updateTime: number;
}

export interface FuturesAccountInfo {
    totalInitialMargin: string;
    totalMaintMargin: string;
    totalWalletBalance: string;
    totalUnrealizedProfit: string;
    totalMarginBalance: string;
    totalPositionInitialMargin: string;
    totalOpenOrderInitialMargin: string;
    totalCrossWalletBalance: string;
    totalCrossUnPnl: string;
    availableBalance: string;
    maxWithdrawAmount: string;
    assets: FuturesAsset[];
}

export interface FuturesBalanceEntry {
    accountAlias: string;
    asset: string;
    balance: string;
    crossWalletBalance: string;
    crossUnPnl: string;
    availableBalance: string;
    maxWithdrawAmount: string;
    marginAvailable: boolean;
    updateTime: number;
}


export type BinanceOrderSide = 'BUY' | 'SELL';
export type BinanceOrderType = 'MARKET' | 'LIMIT';
