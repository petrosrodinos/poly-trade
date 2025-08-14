import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { Bot, BotFormData, UpdateBotFormData, UserBotSubscription } from "../interfaces/bot.interface";

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


export const deleteBot = async (id: string): Promise<Bot> => {
    try {
        const response = await axiosInstance.delete(`${ApiRoutes.bot.prefix}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateBot = async (bot: UpdateBotFormData): Promise<Bot> => {
    try {
        const response = await axiosInstance.put(`${ApiRoutes.bot.prefix}/${bot.uuid}`, bot);
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

export const getBotSubscriptionForUser = async (uuid: string): Promise<UserBotSubscription> => {
    try {
        const response = await axiosInstance.get(`${ApiRoutes.bot.bot_subscription(uuid)}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};