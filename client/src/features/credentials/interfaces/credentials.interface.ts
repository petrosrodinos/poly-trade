export interface Credentials {
    id: number;
    uuid: string;
    user_uuid: string;
    type: CredentialsType;
    api_key: string;
    api_secret: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCredentialsRequest {
    type: CredentialsType;
    api_key: string;
    api_secret: string;
}

export const CredentialsType = {
    BINANCE: 'BINANCE'
} as const;

export type CredentialsType = typeof CredentialsType[keyof typeof CredentialsType];

export interface CredentialsFormValues {
    api_key: string;
    api_secret: string;
    type?: CredentialsType;
}
