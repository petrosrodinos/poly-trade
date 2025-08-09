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

