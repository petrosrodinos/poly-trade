export interface TradingviewAlertWebhook {
    ticker: string;
    interval: string;
    time: string;
    strategy: Strategy;
    bot: string;
    alert_message: string;
    action: string;
}

export const Strategy = {
    two_candles: "two_candles",
    two_candles_noise: "two_candles_noise",
} as const;

export type Strategy = (typeof Strategy)[keyof typeof Strategy];