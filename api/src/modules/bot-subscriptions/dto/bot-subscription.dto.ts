import { TradeProfitSummary } from '../../account/interfaces/account.interfaces';
import { z } from 'zod';

export const CreateBotSubscriptionSchema = z.object({
    bot_uuid: z.string().min(1, 'Bot ID is required'),
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
    active: z.boolean().optional(),
    user_uuid: z.string().optional()
});

export type CreateBotSubscriptionDto = z.infer<typeof CreateBotSubscriptionSchema>;
export type UpdateBotSubscriptionDto = z.infer<typeof UpdateBotSubscriptionSchema>;
export type BotSubscriptionQueryDto = z.infer<typeof BotSubscriptionQuerySchema>;

export interface BotSubscriptionResponse {
    id: number;
    uuid: string;
    user_id: number;
    bot_uuid: string;
    amount: number;
    leverage: number;
    active: boolean;
    trades?: TradeProfitSummary;
    profit?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface PaginatedBotSubscriptionsResponse {
    bot_subscriptions: BotSubscriptionResponse[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}
