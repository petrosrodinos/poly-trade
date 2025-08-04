import { AccountException, InsufficientBalanceException, TradingException } from "../../modules/trades/errors";
import { AlpacaClient } from "./alpaca.client";
import { AlpacaAccount, AlpacaPosition } from "./alpaca.interface";

export class AlpacaService {
    alpacaClient: AlpacaClient;

    constructor() {
        this.alpacaClient = new AlpacaClient();

    }

    async getAccount(): Promise<AlpacaAccount> {
        try {
            const account = await this.alpacaClient.getClient().getAccount();
            return account as AlpacaAccount;
        } catch (error) {
            console.error('Error fetching account information:', error);
            throw new AccountException('Failed to fetch account information');
        }
    }

    async getPosition(symbol: string): Promise<AlpacaPosition | null> {
        try {
            const position = await this.alpacaClient.getClient().getPosition(symbol);
            return position as AlpacaPosition;
        } catch (error) {
            return null;
        }
    }

    async validateBalance(symbol: string, side: 'buy' | 'sell', qty: number): Promise<void> {
        const account = await this.getAccount();

        if (side === 'buy') {
            const buyingPower = parseFloat(account.buying_power);
            if (buyingPower <= 0) {
                throw new InsufficientBalanceException(symbol, qty, buyingPower);
            }
        } else if (side === 'sell') {
            const position = await this.getPosition(symbol);
            if (!position) {
                throw new InsufficientBalanceException(symbol, qty, 0);
            }

            const availableQty = parseFloat(position.qty);
            if (availableQty < qty) {
                throw new InsufficientBalanceException(symbol, qty, availableQty);
            }
        }
    }

    async openPosition(symbol: string, side: 'buy' | 'sell'): Promise<void> {
        const qty = 1;

        try {
            await this.validateBalance(symbol, side, qty);

            await this.alpacaClient.getClient().createOrder({
                symbol,
                qty,
                side,
                type: 'market',
                time_in_force: 'gtc'
            });

            console.log(`Opened ${side} position for ${symbol}`);
        } catch (error: any) {
            if (error instanceof InsufficientBalanceException) {
                console.warn(`Cannot open ${side} position for ${symbol}: ${error.message}`);
                return;
            }

            console.error(`Error opening ${side} position for ${symbol}:`, error);

            if (error.response?.data) {
                const errorData = error.response.data;
                if (errorData.code === 40310000) {
                    throw new InsufficientBalanceException(
                        errorData.symbol || symbol,
                        qty,
                        parseFloat(errorData.available || '0')
                    );
                }
                throw new TradingException(errorData.message || 'Trading error occurred', symbol, side);
            }

            throw new TradingException('Failed to open position', symbol, side);
        }
    }

    async closePosition(symbol: string): Promise<void> {
        try {
            const position = await this.getPosition(symbol);
            if (!position) {
                console.warn(`No position found to close for ${symbol}`);
                return;
            }

            await this.alpacaClient.getClient().closePosition(symbol);
            console.log(`Closed position for ${symbol}`);
        } catch (error: any) {
            console.error(`Error closing position for ${symbol}:`, error);

            if (error.response?.data) {
                const errorData = error.response.data;
                throw new TradingException(errorData.message || 'Failed to close position', symbol);
            }

            throw new TradingException('Failed to close position', symbol);
        }
    }

}