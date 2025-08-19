import type { BotSubscription } from "@/features/bot-subscription/interfaces/bot-subscription.interface";

export interface User {
    uuid: string;
    username: string;
    role: RoleType;
    enabled: boolean;
    verified: boolean;
    commission?: number;
    commission_paid?: number;
    balance?: number;
    subscriptions: BotSubscription[];
    createdAt: string;
}

export interface UserUpdate {
    uuid: string;
    username?: string;
    enabled?: boolean;
}



export interface LoggedInUser {
    user_uuid: string | null;
    role: RoleType | null;
    token: string | null;
    verified: boolean;
    enabled: boolean;
    expires_in: number | null;
    username?: string | null;
    isLoggedIn?: boolean | null;
}



export const RoleTypes = {
    user: "USER",
    admin: "ADMIN",
} as const;

export type RoleType = (typeof RoleTypes)[keyof typeof RoleTypes];