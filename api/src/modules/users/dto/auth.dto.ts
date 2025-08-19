import { z } from 'zod';

export const LoginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required')
});

export const RegisterSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be less than 20 characters'),
    password: z.string().min(5, 'Password must be at least 5 characters'),
});

export const UpdateUserSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be less than 20 characters'),
    enabled: z.boolean().optional(),
    meta: z.record(z.string(), z.any()).optional(),
});

export type LoginDto = z.infer<typeof LoginSchema>;
export type RegisterDto = z.infer<typeof RegisterSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

export interface JwtPayload {
    uuid: string;
    username: string;
    role: string;
    verified: boolean;
    enabled: boolean;
}

export interface AuthResponse {
    user: {
        uuid: string;
        username: string;
        role: string;
        verified: boolean;
        enabled: boolean;
    };
    token: string;
}
