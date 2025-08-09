import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBots, createBot, startBot, stopBot, deleteBot } from "../services/bot.service";

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
            queryClient.invalidateQueries({ queryKey: ["bots"] });
        },
    });
};

export const useStartBot = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: startBot,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bots"] });
        },
    });
};

export const useStopBot = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: stopBot,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bots"] });
        },
    });
};

export const useDeleteBot = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteBot,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bots"] });
        },
    });
};
