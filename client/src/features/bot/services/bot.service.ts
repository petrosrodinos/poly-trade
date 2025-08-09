import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { Bot } from "../interfaces/bot.interface";

export const getBots = async (): Promise<Bot[]> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.bot.prefix);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createBot = async (bot: Bot): Promise<Bot> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.bot.prefix, bot);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const startBot = async (botId: string): Promise<Bot> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.bot.start, { botId });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const stopBot = async (botId: string): Promise<Bot> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.bot.stop, { botId });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteBot = async (botId: string): Promise<Bot> => {
    try {
        const response = await axiosInstance.delete(`${ApiRoutes.bot.prefix}/${botId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
