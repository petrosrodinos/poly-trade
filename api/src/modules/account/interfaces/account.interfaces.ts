export interface TradeProfitSummary {
    grossProfit: number;
    commission: number;
    netProfit: number;
    averageProfit: number;
    averageCommission: number;
    trades: number;
    winRate: number;
    loseRate: number;
}

export interface AccountSummary {
    totalWalletBalance: number;
    availableBalance: number;
    trades?: TradeProfitSummary;
    income: TradeProfitSummary;
}

export interface AccountChartData {
    time: string;
    value: number;
}

export type Timeframe = "1minute" | "3minute" | "5minute" | "15minute" | "30minute" | "hour" | "day" | "week" | "month";

