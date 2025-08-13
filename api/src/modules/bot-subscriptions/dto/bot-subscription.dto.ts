import { z } from 'zod';

export const CreateBotSubscriptionSchema = z.object({
    bot_id: z.number().min(1, 'Bot ID is required'),
    amount: z.number().min(1, 'Amount must be greater than 0'),
    leverage: z.number().min(1, 'Leverage must be greater than 0'),
    active: z.boolean().optional().default(false)
});

export const UpdateBotSubscriptionSchema = z.object({
    amount: z.number().min(1, 'Amount must be greater than 0').optional(),
    leverage: z.number().min(1, 'Leverage must be greater than 0').optional(),
    active: z.boolean().optional()
});

export const BotSubscriptionQuerySchema = z.object({
    page: z.number().min(1).optional().default(1),
    limit: z.number().min(1).max(100).optional().default(10),
    bot_id: z.number().optional(),
    active: z.boolean().optional(),
    user_id: z.number().optional()
});

export type CreateBotSubscriptionDto = z.infer<typeof CreateBotSubscriptionSchema>;
export type UpdateBotSubscriptionDto = z.infer<typeof UpdateBotSubscriptionSchema>;
export type BotSubscriptionQueryDto = z.infer<typeof BotSubscriptionQuerySchema>;

export interface BotSubscriptionResponse {
    id: number;
    uuid: string;
    user_id: number;
    bot_id: number;
    amount: number;
    leverage: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    bot?: {
        id: number;
        uuid: string;
        symbol: string;
        timeframe: string;
        active: boolean;
    };
    user?: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
    };
}

export interface PaginatedBotSubscriptionsResponse {
    bot_subscriptions: BotSubscriptionResponse[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}
