import { CredentialsType } from '@prisma/client';
import { z } from 'zod';

export const CreateCredentialsSchema = z.object({
    type: z.enum(['BINANCE']).default('BINANCE'),
    api_key: z.string().min(1, 'API key is required'),
    api_secret: z.string().min(1, 'API secret is required')
});

export const UpdateCredentialsSchema = z.object({
    type: z.enum(['BINANCE']).optional(),
    api_key: z.string().min(1, 'API key is required').optional(),
    api_secret: z.string().min(1, 'API secret is required').optional()
});

export const CredentialsQuerySchema = z.object({
    page: z.number().min(1).optional().default(1),
    limit: z.number().min(1).max(100).optional().default(10),
    type: z.enum(['BINANCE']).optional()
});

export type CreateCredentialsDto = z.infer<typeof CreateCredentialsSchema>;
export type UpdateCredentialsDto = z.infer<typeof UpdateCredentialsSchema>;
export type CredentialsQueryDto = z.infer<typeof CredentialsQuerySchema>;

export interface CredentialsResponse {
    id: number;
    uuid: string;
    user_uuid: string;
    type: CredentialsType;
    api_key: string;
    api_secret: string;
    createdAt: Date;
    updatedAt: Date;
}


