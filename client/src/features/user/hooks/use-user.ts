import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword, deleteUser, getMe, getUsers, updateUser, updateUserAdmin } from "../services/users.service";
import { toast } from "@/hooks/use-toast";

export const useGetMe = () => {
    return useQuery({
        queryKey: ["user", "me"],
        queryFn: getMe,
    });
};

export const useUpdateUserAdmin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateUserAdmin,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast({
                title: "User updated",
                description: "User has been updated",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "error",
            });
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user", "me"] });
            toast({
                title: "User updated",
                description: "User has been updated",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
            });
        },
    });
};

export const useGetUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: () => getUsers(),
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: changePassword,
        onSuccess: () => {
            toast({
                title: "Password changed",
                description: "Password has been changed, you have to login again",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "error",
            });
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast({
                title: "User deleted",
                description: "User has been deleted",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "error",
            });
        },
    });
};