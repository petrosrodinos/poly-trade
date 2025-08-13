import type { LoggedInUser } from "@/features/user/interfaces/user.interface";

export const formatAuthUser = (data: any): LoggedInUser => {
    return {
        user_uuid: data.user.uuid,
        token: data.token,
        expires_in: data?.expires_in ?? null,
        username: data?.user?.username,
        role: data?.user?.role ?? null,
    };
};