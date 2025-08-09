
export interface User {
    id: string;
    uuid: string;
    email: string;
    role: RoleType;
    created_at: string;
    updated_at: string;
}



export interface LoggedInUser {
    user_uuid: string | null;
    email: string | null;
    role: RoleType | null;
    access_token: string | null;
    expires_in: number | null;
    avatar?: string | null;
    full_name?: string | null;
    isNewUser?: boolean | null;
    isLoggedIn?: boolean | null;
}



export const RoleTypes = {
    user: "user",
    admin: "admin",
    super_admin: "super_admin",
    support: "support",
} as const;

export type RoleType = (typeof RoleTypes)[keyof typeof RoleTypes];