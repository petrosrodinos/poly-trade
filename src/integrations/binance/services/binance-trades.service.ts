import { BinanceClient } from "../binance.client";
import { BinanceAccount, BinancePosition, BinanceOrderResponse, BinanceOrderSide, BinanceOrderType } from "../binance.interfaces";

export class BinanceTradesService {
    private binanceClient: any;

    constructor() {
        const client = new BinanceClient();
        this.binanceClient = client.getClient();
    }

    async getAccount(): Promise<BinanceAccount> {
        try {
            const accountInfo = await this.binanceClient.account();

            return {
                id: accountInfo.accountId || 'N/A',
                status: accountInfo.canTrade ? 'ACTIVE' : 'INACTIVE',
                buying_power: accountInfo.totalWalletBalance || '0',
                cash: accountInfo.availableBalance || '0',
                portfolio_value: accountInfo.totalWalletBalance || '0',
                balances: accountInfo.balances || []
            };
        } catch (error) {
            console.error('Error getting Binance account:', error);
            throw new Error(`Failed to get account information: ${error}`);
        }
    }

    async getPosition(symbol: string): Promise<BinancePosition | null> {
        try {
            const positions = await this.binanceClient.futuresPositionRisk();
            const position = positions.find((pos: any) => pos.symbol === symbol);

            if (!position || parseFloat(position.positionAmt) === 0) {
                return null;
            }

            return {
                symbol: position.symbol,
                positionAmt: position.positionAmt,
                entryPrice: position.entryPrice,
                markPrice: position.markPrice,
                unRealizedProfit: position.unRealizedProfit,
                positionSide: position.positionSide
            };
        } catch (error: any) {
            console.error(`Error getting position for ${symbol}:`, error);

            if (error.message && error.message.includes('-2015')) {
                throw new Error(`API authentication failed. Please check your Binance API credentials and permissions. Ensure you're using the correct credentials for ${process.env.BINANCE_USE_TESTNET === 'true' ? 'testnet' : 'mainnet'}.`);
            }

            throw new Error(`Failed to get position for ${symbol}: ${error.message || error}`);
        }
    }

    async openPosition(symbol: string, side: 'buy' | 'sell', price: number, quantity?: number): Promise<BinanceOrderResponse> {
        try {
            const orderSide: BinanceOrderSide = side.toUpperCase() as BinanceOrderSide;

            if (!quantity) {
                const accountInfo = await this.getAccount();
                const availableBalance = parseFloat(accountInfo.cash);
                quantity = Math.floor((availableBalance * 0.1) / price * 100) / 100;
            }

            if (quantity <= 0) {
                throw new Error('Insufficient balance to open position');
            }

            const order = orderSide === 'BUY'
                ? await this.binanceClient.futuresMarketBuy(symbol, quantity)
                : await this.binanceClient.futuresMarketSell(symbol, quantity);

            return {
                symbol: order.symbol,
                orderId: order.orderId,
                clientOrderId: order.clientOrderId,
                transactTime: order.transactTime,
                price: order.price || price.toString(),
                origQty: order.origQty,
                executedQty: order.executedQty,
                status: order.status,
                timeInForce: order.timeInForce,
                type: order.type,
                side: order.side
            };
        } catch (error) {
            console.error(`Error opening ${side} position for ${symbol}:`, error);
            throw new Error(`Failed to open ${side} position for ${symbol}: ${error}`);
        }
    }

    async closePosition(symbol: string): Promise<BinanceOrderResponse | null> {
        try {
            const position = await this.getPosition(symbol);

            if (!position) {
                console.log(`No position to close for ${symbol}`);
                return null;
            }

            const positionAmount = parseFloat(position.positionAmt);
            const quantity = Math.abs(positionAmount);

            const order = await this.binanceClient.futuresMarketSell(symbol, quantity);

            return {
                symbol: order.symbol,
                orderId: order.orderId,
                clientOrderId: order.clientOrderId,
                transactTime: order.transactTime,
                price: order.price,
                origQty: order.origQty,
                executedQty: order.executedQty,
                status: order.status,
                timeInForce: order.timeInForce,
                type: order.type,
                side: order.side
            };
        } catch (error) {
            console.error(`Error closing position for ${symbol}:`, error);
            throw new Error(`Failed to close position for ${symbol}: ${error}`);
        }
    }

    async placeLimitOrder(symbol: string, side: BinanceOrderSide, quantity: number, price: number): Promise<BinanceOrderResponse> {
        try {
            const order = side === 'BUY'
                ? await this.binanceClient.futuresLimitBuy(symbol, quantity, price)
                : await this.binanceClient.futuresLimitSell(symbol, quantity, price);

            return {
                symbol: order.symbol,
                orderId: order.orderId,
                clientOrderId: order.clientOrderId,
                transactTime: order.transactTime,
                price: order.price,
                origQty: order.origQty,
                executedQty: order.executedQty,
                status: order.status,
                timeInForce: order.timeInForce,
                type: order.type,
                side: order.side
            };
        } catch (error) {
            console.error(`Error placing limit order for ${symbol}:`, error);
            throw new Error(`Failed to place limit order for ${symbol}: ${error}`);
        }
    }

    async cancelOrder(symbol: string, orderId: number): Promise<boolean> {
        try {
            await this.binanceClient.futuresCancel(symbol, { orderId });
            return true;
        } catch (error) {
            console.error(`Error cancelling order ${orderId} for ${symbol}:`, error);
            return false;
        }
    }

    async getOpenOrders(symbol?: string): Promise<any[]> {
        try {
            const orders = symbol
                ? await this.binanceClient.futuresOpenOrders(symbol)
                : await this.binanceClient.futuresOpenOrders();

            return orders;
        } catch (error) {
            console.error('Error getting open orders:', error);
            throw new Error(`Failed to get open orders: ${error}`);
        }
    }
}