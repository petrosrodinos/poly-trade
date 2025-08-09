import axios from 'axios'
import { API_URL } from './routes'
import { getAuthStoreState } from '@/stores/auth.store'
import { isTokenExpired } from '@/lib/token';

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    const authState = getAuthStoreState();

    if (authState?.expires_in && isTokenExpired(authState.expires_in)) {
        authState.logout();

        return Promise.reject(new Error('Token expired'));
    }

    if (authState.access_token) {
        config.headers.Authorization = `Bearer ${authState.access_token}`;
    }

    return config;
});

export default axiosInstance