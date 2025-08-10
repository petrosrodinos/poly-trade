export interface TradeProfitSummary {
    grossProfit: number;
    commission: number;
    netProfit: number;
    averageProfit: number;
    averageCommission: number;
    trades: number;
}

export interface AccountSummary {
    totalWalletBalance: number;
    availableBalance: number;
    trades: TradeProfitSummary;
    income: TradeProfitSummary;
}

export interface FuturesTrade {
    symbol: string;
    id: number;
    orderId: number;
    side: 'BUY' | 'SELL';
    price: string;
    qty: string;
    realizedPnl: string;
    unrealizedPnl: string;
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
    income: string;
    asset: string;
    time: number;
    info: string;
    tranId: number;
    tradeId: string;
}

export interface AccountIncomeChart {
    time: string;
    value: number;
}