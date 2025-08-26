export interface Credential {
    user_uuid: string;
    api_key: string;
    api_secret: string;
    type: ExchangeType;
    passphrase?: string;
}

export interface BrokerFuturesAsset {
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

export interface BrokerFuturesAccountInfo {
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
    assets: BrokerFuturesAsset[];
}

export interface BrokerFuturesTrade {
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
    time: number;
    positionSide: 'BOTH' | 'LONG' | 'SHORT';
    maker: boolean;
    buyer: boolean;
}

export interface BrokerIncome {
    symbol: string;
    incomeType: 'REALIZED_PNL' | 'COMMISSION' | 'FUNDING_FEE' | string;
    income: string;
    asset: string;
    time: number;
    info: string;
    tranId: number;
    tradeId: string;
}

export interface BrokerIncomeTradesAndProfit {
    profit: number;
    income: BrokerIncome[];
}

export interface BrokerFuturesTradeAndProfit {
    profit: number;
    trades: BrokerFuturesTrade[];
}

export const Exchanges = {
    DEFAULT: 'BINANCE',
    BINANCE: 'BINANCE',
    ALPACA: 'ALPACA',
    COINBASE: 'COINBASE',
    KRAKEN: 'KRAKEN',
    MEXC: 'MEXC'
}

export type ExchangeType = typeof Exchanges[keyof typeof Exchanges];