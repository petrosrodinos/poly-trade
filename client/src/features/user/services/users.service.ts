import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { UserAdmin, UserUpdate } from "../interfaces/user.interface";

export const getUsers = async (): Promise<UserAdmin[]> => {
    const response = await axiosInstance.get(ApiRoutes.users.prefix);
    return response.data;
};

export const updateUser = async (data: UserUpdate) => {
    const response = await axiosInstance.put(`${ApiRoutes.users.prefix}/${data.uuid}`, data);
    return response.data;
};


export const getMe = async () => {
    const response = await axiosInstance.get(`${ApiRoutes.users.prefix}/me`);
    return response.data;
};

export const deleteUser = async (uuid: string) => {
    const response = await axiosInstance.delete(`${ApiRoutes.users.prefix}/${uuid}`);
    return response.data;
};


