
export interface User {
    uuid: string;
    username: string;
    role: RoleType;
    created_at: string;
    updated_at: string;
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