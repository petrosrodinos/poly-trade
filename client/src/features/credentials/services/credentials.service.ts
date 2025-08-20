import axiosInstance from '@/config/api/axios';
import { type CreateCredentialsRequest, type Credentials } from '../interfaces/credentials.interface';
import { ApiRoutes } from '@/config/api/routes';

export const createCredentials = async (data: CreateCredentialsRequest): Promise<Credentials> => {
    const response = await axiosInstance.post(ApiRoutes.credentials.prefix, data);
    return response.data;
}

export const getUserCredentials = async (): Promise<Credentials> => {
    const response = await axiosInstance.get(ApiRoutes.credentials.user);
    return response.data;
}


