import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMe, getUsers, updateUser } from "../services/users.service";

export const useGetMe = () => {
    return useQuery({
        queryKey: ["user", "me"],
        queryFn: getMe,
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => {
            console.log(error);
        },
    });
};

export const useGetUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: () => getUsers(),
    });
};