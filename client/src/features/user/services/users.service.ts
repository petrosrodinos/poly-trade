import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { ChangePassword, User, UserAdmin, UserUpdate } from "../interfaces/user.interface";

export const getUsers = async (): Promise<UserAdmin[]> => {
    const response = await axiosInstance.get(ApiRoutes.users.prefix);
    return response.data;
};

export const updateUserAdmin = async (data: UserUpdate) => {
    const response = await axiosInstance.put(`${ApiRoutes.users.prefix}/${data.uuid}`, data);
    return response.data;
};

export const updateUser = async (data: UserUpdate) => {
    const response = await axiosInstance.put(`${ApiRoutes.users.prefix}`, data);
    return response.data;
};

export const changePassword = async (data: ChangePassword) => {
    try {
        const response = await axiosInstance.post(ApiRoutes.users.change_password, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.error);
    }
};

export const getMe = async (): Promise<User> => {
    const response = await axiosInstance.get(`${ApiRoutes.users.prefix}/me`);
    return response.data;
};

export const deleteUser = async (uuid: string) => {
    const response = await axiosInstance.delete(`${ApiRoutes.users.prefix}/${uuid}`);
    return response.data;
};


