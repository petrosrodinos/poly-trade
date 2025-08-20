import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { createBotSubscription, deleteBotSubscription, updateBotSubscription, startAllBotSubscriptions, stopAllBotSubscriptions, getBotSubscriptionByBotUuid, getBotSubscriptions } from "../services/bot-subscription.service";


export const useCreateBotSubscription = (bot_uuid: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBotSubscription,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bot-subscription", bot_uuid] });
            // queryClient.invalidateQueries({ queryKey: ["bot", bot_uuid] });
            toast({
                title: "Bot subscription created successfully",
                description: "Bot subscription created successfully",
            });

        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.message || "Failed to create bot subscription",
                variant: "error",
            });
        },
    });
};

export const useGetBotSubscriptions = () => {
    return useQuery({
        queryKey: ["bot-subscriptions"],
        queryFn: getBotSubscriptions,
    });
}


export const useBotSubscriptionByBotUuid = (bot_uuid: string) => {
    return useQuery({
        queryKey: ["bot-subscription", bot_uuid],
        queryFn: () => getBotSubscriptionByBotUuid(bot_uuid),
        enabled: !!bot_uuid,
        retry: false,
    });
}


export const useUpdateBotSubscription = (bot_uuid: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateBotSubscription,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bot-subscription", bot_uuid] });
            toast({
                title: "Bot subscription updated successfully",
                description: "Bot subscription updated successfully",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to update bot subscription",
                variant: "error",
            });
        },
    });
}

export const useDeleteBotSubscription = (bot_uuid: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteBotSubscription,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bot-subscription", bot_uuid] });
            toast({
                title: "Bot subscription deleted successfully",
                description: "Bot subscription deleted successfully",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to delete bot subscription",
                variant: "error",
            });
        },
    });
};

export const useStartAllBotSubscriptions = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: startAllBotSubscriptions,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bot-subscriptions"] });
            toast({
                title: "All bot subscriptions started successfully",
                description: "All bot subscriptions started successfully",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to start all bot subscriptions",
                variant: "error",
            });
        },
    });
}

export const useStopAllBotSubscriptions = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: stopAllBotSubscriptions,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bot-subscriptions"] });
            toast({
                title: "All bot subscriptions stopped successfully",
                description: "All bot subscriptions stopped successfully",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to stop all bot subscriptions",
                variant: "error",
            });
        },
    });
}