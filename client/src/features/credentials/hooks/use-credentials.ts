import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserCredentials, createCredentials } from '../services/credentials.service';
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
                description: error.response?.data?.error || 'Failed to save credentials',
            });
        },
    });
};


