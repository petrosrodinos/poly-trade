import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { Bot, BotFormData } from "../interfaces/bot.interface";

export const getBots = async (): Promise<Bot[]> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.bot.get);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getBot = async (id: string): Promise<Bot> => {
    try {
        const response = await axiosInstance.get(`${ApiRoutes.bot.prefix}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createBot = async (bot: BotFormData): Promise<Bot> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.bot.prefix, bot);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.error || "Failed to create bot");
    }
};

export const startBot = async (id: string): Promise<Bot> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.bot.start, { id });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const stopBot = async (id: string): Promise<Bot> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.bot.stop, { id });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteBot = async (id: string): Promise<Bot> => {
    try {
        const response = await axiosInstance.delete(`${ApiRoutes.bot.prefix}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateBot = async (bot: Bot): Promise<Bot> => {
    try {
        const response = await axiosInstance.put(`${ApiRoutes.bot.prefix}/${bot.id}`, bot);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const startAllBots = async (): Promise<Bot[]> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.bot.start_all);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const stopAllBots = async (): Promise<Bot[]> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.bot.stop_all);
        return response.data;
    } catch (error) {
        throw error;
    }
};
