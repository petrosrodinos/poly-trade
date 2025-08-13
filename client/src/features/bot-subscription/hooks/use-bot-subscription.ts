import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { getBotSubscriptions, createBotSubscription, startBotSubscription, stopBotSubscription, deleteBotSubscription, updateBotSubscription, startAllBotSubscriptions, stopAllBotSubscriptions, getBotSubscription } from "../services/bot-subscription.service";

export const useBotSubscriptions = () => {
    return useQuery({
        queryKey: ["bot-subscriptions"],
        queryFn: getBotSubscriptions,
    });
};

export const useCreateBotSubscription = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBotSubscription,
        onSuccess: () => {
            toast({
                title: "Bot subscription created successfully",
                description: "Bot subscription created successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["bot-subscriptions"] });
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

export const useBotSubscription = (id: string) => {
    return useQuery({
        queryKey: ["bot-subscription", id],
        queryFn: () => getBotSubscription(id),
        enabled: !!id,
    });
}

export const useStartBot = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: startBotSubscription,
        onSuccess: () => {
            toast({
                title: "Bot subscription started successfully",
                description: "Bot subscription started successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["bot-subscription", id] });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to start bot subscription",
                variant: "error",
            });
        },
    });
};

export const useStopBot = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: stopBotSubscription,
        onSuccess: () => {
            toast({
                title: "Bot subscription stopped successfully",
                description: "Bot subscription stopped successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["bot-subscription", id] });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to stop bot subscription",
                variant: "error",
            });
        },
    });
};

export const useUpdateBot = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateBotSubscription,
        onSuccess: () => {
            toast({
                title: "Bot subscription updated successfully",
                description: "Bot subscription updated successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["bot-subscription", id] });
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

export const useDeleteBot = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteBotSubscription,
        onSuccess: () => {
            toast({
                title: "Bot subscription deleted successfully",
                description: "Bot subscription deleted successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["bot-subscriptions"] });
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