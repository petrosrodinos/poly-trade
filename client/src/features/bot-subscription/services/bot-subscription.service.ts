import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { BotSubscription, BotSubscriptionFormData } from "../interfaces/bot-subscription.interface";

export const getBotSubscriptions = async (): Promise<BotSubscription[]> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.bot_subscription.prefix);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getBotSubscription = async (id: string): Promise<BotSubscription> => {
    try {
        const response = await axiosInstance.get(`${ApiRoutes.bot_subscription.prefix}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createBotSubscription = async (bot: BotSubscriptionFormData): Promise<BotSubscription> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.bot_subscription.prefix, bot);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.error || "Failed to create bot");
    }
};

export const startBotSubscription = async (id: string): Promise<BotSubscription> => {
    try {
        const response = await axiosInstance.post(`${ApiRoutes.bot_subscription.prefix}/start/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const stopBotSubscription = async (id: string): Promise<BotSubscription> => {
    try {
        const response = await axiosInstance.post(`${ApiRoutes.bot_subscription.prefix}/stop/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteBotSubscription = async (id: string): Promise<BotSubscription> => {
    try {
        const response = await axiosInstance.delete(`${ApiRoutes.bot_subscription.prefix}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateBotSubscription = async (bot: BotSubscription): Promise<BotSubscription> => {
    try {
        const response = await axiosInstance.put(`${ApiRoutes.bot_subscription.prefix}/${bot.id}`, bot);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const startAllBotSubscriptions = async (): Promise<BotSubscription[]> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.bot_subscription.start_all);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const stopAllBotSubscriptions = async (): Promise<BotSubscription[]> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.bot_subscription.stop_all);
        return response.data;
    } catch (error) {
        throw error;
    }
};
