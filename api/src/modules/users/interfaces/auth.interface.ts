export interface JwtPayload {
    uuid: string;
    username: string;
    role: string;
    verified: boolean;
    enabled: boolean;
}

export interface AuthResponse {
    user: {
        uuid: string;
        username: string;
        role: string;
        verified: boolean;
        enabled: boolean;
    };
    token: string;
}