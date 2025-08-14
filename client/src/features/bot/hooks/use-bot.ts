import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBots, createBot, deleteBot, startAllBots, stopAllBots, updateBot, getBot, getBotSubscriptionForUser } from "../services/bot.service";
import { toast } from "@/hooks/use-toast";

export const useBots = () => {
    return useQuery({
        queryKey: ["bots"],
        queryFn: getBots,
    });
};

export const useCreateBot = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBot,
        onSuccess: () => {
            toast({
                title: "Bot created successfully",
                description: "Bot created successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["bots"] });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.message || "Failed to create bot",
                variant: "error",
            });
        },
    });
};

export const useBot = (uuid: string) => {
    return useQuery({
        queryKey: ["bot", uuid],
        queryFn: () => getBot(uuid),
        enabled: !!uuid,
    });
}

export const useUpdateBot = (uuid: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateBot,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bot", uuid] });
            toast({
                title: "Bot updated successfully",
                description: "Bot updated successfully",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to update bot",
                variant: "error",
            });
        },
    });
}

export const useDeleteBot = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteBot,
        onSuccess: () => {
            toast({
                title: "Bot deleted successfully",
                description: "Bot deleted successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["bots"] });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to delete bot",
                variant: "error",
            });
        },
    });
};

export const useStartAllBots = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: startAllBots,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bots"] });
            toast({
                title: "All bots started successfully",
                description: "All bots started successfully",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to start all bots",
                variant: "error",
            });
        },
    });
}

export const useStopAllBots = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: stopAllBots,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bots"] });
            toast({
                title: "All bots stopped successfully",
                description: "All bots stopped successfully",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to stop all bots",
                variant: "error",
            });
        },
    });
}

export const useGetBotSubscriptionForUser = (uuid: string) => {
    return useQuery({
        queryKey: ["bot-subscription", uuid],
        queryFn: () => getBotSubscriptionForUser(uuid),
        enabled: !!uuid,
    });
}