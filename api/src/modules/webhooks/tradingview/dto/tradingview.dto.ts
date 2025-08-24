import { z } from 'zod';


export const ActionSchema = z.enum(['buy', 'sell']);

export const TypeSchema = z.enum(['crypto', 'stock', 'forex']);

export const TradingviewAlertWebhookSchema = z.object({
    uuid: z.string().min(1),
    symbol: z.string().min(1),
    type: TypeSchema,
    interval: z.string().min(1),
    time: z.string().min(1),
    strategy: z.string().min(1),
    action: ActionSchema,
    close: z.number(),
});

export type TradingviewAlertWebhookDto = z.infer<typeof TradingviewAlertWebhookSchema>;
