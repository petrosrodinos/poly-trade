import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { BotSubscription, BotSubscriptionFormData, BotSubscriptionUpdateFormData } from "../interfaces/bot-subscription.interface";

export const getBotSubscriptions = async (): Promise<BotSubscription[]> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.bot_subscription.prefix);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getBotSubscription = async (uuid: string): Promise<BotSubscription> => {
    try {
        const response = await axiosInstance.get(`${ApiRoutes.bot_subscription.prefix}/${uuid}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getBotSubscriptionByBotUuid = async (bot_uuid: string): Promise<BotSubscription> => {
    try {
        const response = await axiosInstance.get(`${ApiRoutes.bot_subscription.prefix}/bot/${bot_uuid}`);
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


export const deleteBotSubscription = async (uuid: string): Promise<BotSubscription> => {
    try {
        const response = await axiosInstance.delete(`${ApiRoutes.bot_subscription.prefix}/${uuid}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateBotSubscription = async (bot: BotSubscriptionUpdateFormData): Promise<BotSubscription> => {
    try {
        const response = await axiosInstance.put(`${ApiRoutes.bot_subscription.prefix}/${bot.uuid}`, bot);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const startAllBotSubscriptions = async (): Promise<BotSubscription[]> => {
    try {
        const response = await axiosInstance.put(ApiRoutes.bot_subscription.start_all);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const stopAllBotSubscriptions = async (): Promise<BotSubscription[]> => {
    try {
        const response = await axiosInstance.put(ApiRoutes.bot_subscription.stop_all);
        return response.data;
    } catch (error) {
        throw error;
    }
};
