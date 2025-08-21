import { BinanceClient } from "./binance.client";

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

export interface FuturesTrade {
    symbol: string;
    id: number;
    orderId: number;
    side: 'BUY' | 'SELL';
    price: string;
    qty: string;
    realizedPnl: string;
    quoteQty: string;
    commission: string;
    commissionAsset: string;
    time: number; // timestamp in ms
    positionSide: 'BOTH' | 'LONG' | 'SHORT';
    maker: boolean;
    buyer: boolean;
}

export interface FuturesIncome {
    symbol: string;
    incomeType: 'REALIZED_PNL' | 'COMMISSION' | 'FUNDING_FEE' | string;
    income: string; // can be negative
    asset: string;
    time: number; // timestamp in ms
    info: string;
    tranId: number;
    tradeId: string;
}

export interface FuturesIncomeTradesAndProfit {
    profit: number;
    income: FuturesIncome[];
}

export interface FuturesTradeAndProfit {
    profit: number;
    trades: FuturesTrade[];
}

export interface BinanceExchangeInfo {
    minQty: number;
    stepSize: number;
}

export interface TradeQuantity {
    quantity: number;
    price: number;
    minQty: number;
    stepSize: number;
}


export type ClientMap = { [user_uuid: string]: BinanceClient };

export type BinanceOrderSide = 'BUY' | 'SELL';
export type BinanceOrderType = 'MARKET' | 'LIMIT';
