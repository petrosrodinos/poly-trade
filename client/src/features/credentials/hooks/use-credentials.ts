import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type CreateCredentialsRequest } from '../interfaces/credentials.interface';
import { getUserCredentials, createCredentials, updateCredentials, deleteCredentials } from '../services/credentials.service';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Routes } from '@/routes/routes';

export const useUserCredentials = () => {
    return useQuery({
        queryKey: ['credentials'],
        queryFn: getUserCredentials,
        retry: false,
    });
};

export const useCreateCredentials = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: createCredentials,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['credentials'] });
            toast({
                title: 'Success',
                description: 'API credentials saved successfully',
            });
            // navigate(Routes.auth.confirmation);
            navigate(Routes.dashboard.root);

        },
        onError: (error: any) => {
            toast({
                variant: 'error',
                title: 'Error',
                description: error.response?.data?.message || 'Failed to save credentials',
            });
        },
    });
};

export const useUpdateCredentials = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ uuid, data }: { uuid: string; data: Partial<CreateCredentialsRequest> }) =>
            updateCredentials(uuid, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['credentials'] });
            toast({
                title: 'Success',
                description: 'API credentials updated successfully',
            });
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || 'Failed to update credentials',
            });
        },
    });
};

export const useDeleteCredentials = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCredentials,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['credentials'] });
            toast({
                title: 'Success',
                description: 'API credentials deleted successfully',
            });
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || 'Failed to delete credentials',
            });
        },
    });
};

