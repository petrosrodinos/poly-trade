import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { User, UserUpdate } from "../interfaces/user.interface";

export const getUsers = async (): Promise<User[]> => {
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
