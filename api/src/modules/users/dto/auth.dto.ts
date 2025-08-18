import { z } from 'zod';

export const LoginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required')
});

export const RegisterSchema = z.object({
    username: z.string().min(5, 'Username must be at least 5 characters'),
    password: z.string().min(5, 'Password must be at least 5 characters'),
});

export type LoginDto = z.infer<typeof LoginSchema>;
export type RegisterDto = z.infer<typeof RegisterSchema>;

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
