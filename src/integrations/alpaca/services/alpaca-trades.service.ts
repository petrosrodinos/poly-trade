import { AccountException, InsufficientBalanceException, TradingException } from "../../../modules/trades/alpaca/errors";
import { AlpacaClient } from "../alpaca.client";
import { AlpacaAccount, AlpacaPosition } from "../alpaca.interfaces";

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

    async validateBalance(symbol: string, side: 'buy' | 'sell', orderValue: number, qty?: number): Promise<void> {
        const account = await this.getAccount();

        if (side === 'buy') {
            const buyingPower = parseFloat(account.buying_power);
            if (buyingPower < orderValue) {
                throw new InsufficientBalanceException(symbol, qty || 0, buyingPower);
            }
        } else if (side === 'sell') {
            const position = await this.getPosition(symbol);
            if (!position) {
                throw new InsufficientBalanceException(symbol, qty || 0, 0);
            }

            const availableQty = parseFloat(position.qty);
            if (qty && availableQty < qty) {
                throw new InsufficientBalanceException(symbol, qty, availableQty);
            }
        }
    }

    async getLatestPrice(symbol: string): Promise<number> {
        try {
            const quote = await this.alpacaClient.getClient().getLatestQuote(symbol);

            if (quote && quote.BidPrice && quote.AskPrice) {
                return (quote.BidPrice + quote.AskPrice) / 2;
            }

            throw new Error('No price data available');
        } catch (error) {
            console.error(`Error fetching price for ${symbol}:`, error);
            const isCrypto = symbol.includes('/');
            return isCrypto ? 1.0 : 100.0;
        }
    }

    private calculateOrderSize(symbol: string, price: number, side: 'buy' | 'sell'): { qty?: number; notional?: number } {
        const isCrypto = symbol.includes('/');
        const minOrderValue = 10;

        if (side === 'buy') {
            if (isCrypto) {
                return { notional: minOrderValue };
            } else {
                const qty = Math.floor(minOrderValue / price);
                return { qty: Math.max(qty, 1) };
            }
        } else {
            return { qty: 1 };
        }
    }

    async openPosition(symbol: string, side: 'buy' | 'sell', currentPrice?: number): Promise<void> {
        try {
            const price = currentPrice || await this.getLatestPrice(symbol);
            const orderConfig = this.calculateOrderSize(symbol, price, side);
            const orderValue = orderConfig.notional || (orderConfig.qty! * price);

            await this.validateBalance(symbol, side, orderValue, orderConfig.qty);

            const orderParams: any = {
                symbol,
                side,
                type: 'market',
                time_in_force: 'gtc'
            };

            if (orderConfig.qty) {
                orderParams.qty = orderConfig.qty;
            }
            if (orderConfig.notional) {
                orderParams.notional = orderConfig.notional;
            }

            await this.alpacaClient.getClient().createOrder(orderParams);

            console.log(`Opened ${side} position for ${symbol} (value: $${orderValue.toFixed(2)})`);
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
                        0,
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