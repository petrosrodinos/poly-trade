import { z } from 'zod';

export const CreateBotSchema = z.object({
    symbol: z.string().min(1, 'Symbol is required'),
    strategy: z.string().min(1, 'Strategy is required').optional(),
    timeframe: z.string().min(1, 'Timeframe is required'),
    active: z.boolean().optional().default(true),
    visible: z.boolean().optional().default(true)
});

export const UpdateBotSchema = z.object({
    symbol: z.string().min(1, 'Symbol is required').optional(),
    strategy: z.string().min(1, 'Strategy is required').optional(),
    timeframe: z.string().min(1, 'Timeframe is required').optional(),
    active: z.boolean().optional(),
    visible: z.boolean().optional()
});

export const BotQuerySchema = z.object({
    page: z.number().min(1).optional().default(1),
    limit: z.number().min(1).max(100).optional().default(10),
    symbol: z.string().optional(),
    active: z.string().optional().transform(val => val === 'true' ? true : val === 'false' ? false : undefined),
    visible: z.string().optional().transform(val => val === 'true' ? true : val === 'false' ? false : undefined),
    timeframe: z.string().optional()
});

export type CreateBotDto = z.infer<typeof CreateBotSchema>;
export type UpdateBotDto = z.infer<typeof UpdateBotSchema>;
export type BotQueryDto = z.infer<typeof BotQuerySchema>;
