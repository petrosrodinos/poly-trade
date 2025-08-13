import { z } from 'zod';

export const StrategySchema = z.enum(['two_candles', 'two_candles_noise']);

export const ActionSchema = z.enum(['buy', 'sell', 'close']);

export const TradingviewAlertWebhookSchema = z.object({
    ticker: z.string().min(1),
    interval: z.string().min(1),
    time: z.string().min(1),
    strategy: StrategySchema,
    bot: z.string().min(1),
    alert_message: z.string().min(1),
    action: ActionSchema,
});

export type TradingviewAlertWebhookDto = z.infer<typeof TradingviewAlertWebhookSchema>;
