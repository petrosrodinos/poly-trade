import { z } from 'zod';

export const BotFormDataSchema = z.object({
    symbol: z.string()
        .min(1, 'Symbol is required')
        .regex(/^[A-Z0-9]+$/, 'Symbol must contain only uppercase letters and numbers')
        .transform((val) => val.toUpperCase()),
    amount: z.number()
        .positive('Amount must be a positive number')
        .min(0.01, 'Amount must be at least 0.01'),
    interval: z.string()
        .min(1, 'Interval is required')
        .regex(/^(1m|3m|5m|15m|30m|1h|2h|4h)$/, 'Invalid interval format'),
    leverage: z.number()
        .int('Leverage must be an integer')
        .min(1, 'Leverage must be at least 1')
        .max(125, 'Leverage cannot exceed 125'),
    active: z.boolean()
});

// export const BotSchema = z.object({
//     id: z.string()
//         .min(1, 'Bot ID is required'),
//     active: z.boolean(),
//     symbol: z.string()
//         .min(1, 'Symbol is required')
//         .regex(/^[A-Z0-9]+$/, 'Symbol must contain only uppercase letters and numbers'),
//     created_at: z.string()
//         .datetime('Invalid datetime format'),
//     interval: z.string()
//         .min(1, 'Interval is required')
//         .regex(/^(1m|3m|5m|15m|30m|1h|2h|4h|6h|8h|12h|1d|3d|1w|1M)$/, 'Invalid interval format'),
//     amount: z.number()
//         .positive('Amount must be a positive number')
//         .min(0.01, 'Amount must be at least 0.01'),
//     leverage: z.number()
//         .int('Leverage must be an integer')
//         .min(1, 'Leverage must be at least 1')
//         .max(125, 'Leverage cannot exceed 125')
//         .optional()
// });

export const BotStatusSchema = z.object({
    symbol: z.string()
        .min(1, 'Symbol is required'),
    isRunning: z.boolean(),
    position: z.enum(['long', 'short', 'none']),
});

export const SymbolParamSchema = z.object({
    symbol: z.string()
        .min(1, 'Symbol parameter is required')
        .regex(/^[A-Z0-9]+$/, 'Symbol must contain only uppercase letters and numbers')
        .transform((val) => val.toUpperCase())
});

export type BotFormData = z.infer<typeof BotFormDataSchema>;
// export type Bot = z.infer<typeof BotSchema>;
export type BotStatus = z.infer<typeof BotStatusSchema>;
export type SymbolParam = z.infer<typeof SymbolParamSchema>;
