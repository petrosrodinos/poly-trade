import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { UserUpdate } from "../interfaces/user.interface";

export const getUsers = async () => {
    const response = await axiosInstance.get(ApiRoutes.users.prefix);
    return response.data;
};

export const updateUser = async (data: UserUpdate) => {
    const response = await axiosInstance.put(`${ApiRoutes.users.prefix}/${data.uuid}`, data);
    return response.data;
};

export const getUser = async (uuid: string) => {
    const response = await axiosInstance.get(`${ApiRoutes.users.prefix}/${uuid}`);
    return response.data;
};

export const getMe = async () => {
    const response = await axiosInstance.get(`${ApiRoutes.users.prefix}/me`);
    return response.data;
};
