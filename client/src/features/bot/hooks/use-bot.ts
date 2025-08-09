import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBots, createBot, startBot, stopBot, deleteBot } from "../services/bot.service";
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
            console.log(error);
            toast({
                title: "Error",
                description: error?.message || "Failed to create bot",
                variant: "error",
            });
        },
    });
};

export const useStartBot = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: startBot,
        onSuccess: () => {
            toast({
                title: "Bot started successfully",
                description: "Bot started successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["bots"] });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to start bot",
                variant: "error",
            });
        },
    });
};

export const useStopBot = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: stopBot,
        onSuccess: () => {
            toast({
                title: "Bot stopped successfully",
                description: "Bot stopped successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["bots"] });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to stop bot",
                variant: "error",
            });
        },
    });
};

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
