import { formatAuthUser } from "../utils/auth.utils";
import axiosInstance from "@/config/api/axios";
import type { SignInUser, SignUpUser } from "../interfaces/auth.interface";
import { ApiRoutes } from "@/config/api/routes";
import type { LoggedInUser } from "@/features/user/interfaces/user.interface";

export const signIn = async (
    { username, password }: SignInUser,
): Promise<LoggedInUser> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.auth.login, {
            username,
            password,
        });

        const auth_response = response.data;
        return formatAuthUser(auth_response);

    } catch (error) {
        throw new Error("Failed to sign in. Please try again.");
    }
};

export const signUp = async ({ username, password }: SignUpUser): Promise<LoggedInUser> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.auth.register, {
            username,
            password,
        });

        const auth_response = response.data;
        return formatAuthUser(auth_response);
    } catch (error) {
        throw new Error("Failed to sign up. Please try again.");
    }
};


