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

export const createBot = async (bot: BotFormData): Promise<Bot> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.bot.prefix, bot);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.error || "Failed to create bot");
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
