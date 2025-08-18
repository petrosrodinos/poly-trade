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

export const updateCredentials = async (uuid: string, data: Partial<CreateCredentialsRequest>): Promise<Credentials> => {
    const response = await axiosInstance.put(ApiRoutes.credentials.update(uuid), data);
    return response.data;
}

export const deleteCredentials = async (uuid: string): Promise<void> => {
    await axiosInstance.delete(ApiRoutes.credentials.delete(uuid));
}
