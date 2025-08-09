import dotenv from 'dotenv';
dotenv.config();

export interface AlpacaConfig {
    keyId: string;
    secretKey: string;
    paper: boolean;
}

export const getAlpacaConfig = (): AlpacaConfig => ({
    keyId: process.env.ALPACA_API_KEY || '',
    secretKey: process.env.ALPACA_SECRET_KEY || '',
    paper: true
});