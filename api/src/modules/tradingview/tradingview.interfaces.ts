
export const Strategy = {
    two_candles: "two_candles",
    two_candles_noise: "two_candles_noise",
} as const;

export type Strategy = (typeof Strategy)[keyof typeof Strategy];