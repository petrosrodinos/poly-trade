import { TradesConfig } from "../../../shared/constants/trades";
import { BinancePosition, BinanceOrderResponse, BinanceOrderSide } from "../binance.interfaces";
import { logger } from "../../../shared/utils/logger";
import { BinanceClientManager } from "../binance-client-manager";

export class BinanceTradesService {

    constructor() {
    }

    async getPosition(user_uuid: string, symbol: string): Promise<BinancePosition | null> {
        try {
            const binanceClient = await BinanceClientManager.getClientForUser(user_uuid);
            const positions = await binanceClient.futuresPositionRisk();
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
                console.log(`API authentication failed. Please check your Binance API credentials and permissions.`);
            }

            return null;
        }
    }

    async openPosition(user_uuid: string, symbol: string, side: 'buy' | 'sell', quantity?: number, leverage?: number): Promise<BinanceOrderResponse | null> {
        try {
            const orderSide: BinanceOrderSide = side.toUpperCase() as BinanceOrderSide;

            let order;

            const leverageValue = leverage || TradesConfig.leverage;

            const binanceClient = await BinanceClientManager.getClientForUser(user_uuid);
            await binanceClient.futuresLeverage(symbol, leverageValue);

            if (orderSide === 'BUY') {
                order = await binanceClient.futuresMarketBuy(symbol, quantity);
            } else {
                order = await binanceClient.futuresMarketSell(symbol, quantity);
            }


            logger.info(`Opened ${side} position for ${symbol} with quantity ${quantity} and leverage ${leverageValue}`);


            return {
                symbol: order.symbol,
                orderId: order.orderId,
                clientOrderId: order.clientOrderId,
                transactTime: order.transactTime,
                origQty: order.origQty,
                executedQty: order.executedQty,
                status: order.status,
                timeInForce: order.timeInForce,
                type: order.type,
                side: order.side
            };
        } catch (error) {
            console.error(`Error opening ${side} position for ${symbol}:`, error);
            return null;
        }
    }

    async closePosition(user_uuid: string, symbol: string): Promise<BinanceOrderResponse | null> {
        try {
            const binanceClient = await BinanceClientManager.getClientForUser(user_uuid);
            const position = await this.getPosition(user_uuid, symbol);

            if (!position || parseFloat(position.positionAmt) === 0) {
                console.log(`No position to close for ${symbol}`);
                return null;
            }

            const positionAmount = parseFloat(position.positionAmt);
            const quantity = Math.abs(positionAmount);

            logger.info(`Closing ${positionAmount > 0 ? 'LONG' : 'SHORT'} for ${symbol} with quantity ${quantity}`);

            // Determine correct closing side
            let order;
            if (positionAmount > 0) {
                // Long → Close with sell
                order = await binanceClient.futuresMarketSell(symbol, quantity);
            } else if (positionAmount < 0) {
                // Short → Close with buy
                order = await binanceClient.futuresMarketBuy(symbol, quantity);
            }

            // Wait until Binance confirms positionAmt = 0
            for (let retries = 0; retries < 15; retries++) { // max ~3 seconds
                const pos = await this.getPosition(user_uuid, symbol);
                if (!pos || parseFloat(pos.positionAmt) === 0) {
                    break;
                }
                await new Promise(res => setTimeout(res, 200)); // wait 200ms
            }

            return {
                symbol: order.symbol,
                orderId: order.orderId,
                clientOrderId: order.clientOrderId,
                transactTime: order.transactTime,
                origQty: order.origQty,
                executedQty: order.executedQty,
                status: order.status,
                timeInForce: order.timeInForce,
                type: order.type,
                side: order.side
            };
        } catch (error) {
            console.error(`Error closing position for ${symbol}:`, error);
            return null;
        }
    }


    async closeAllPositions(symbols: string[]): Promise<any> {
        try {
            const binanceClients = await BinanceClientManager.getClients();
            for (const [user_uuid, client] of Object.entries(binanceClients)) {
                await Promise.all(symbols.map(symbol => this.closePosition(user_uuid, symbol)));
            }
        } catch (error) {
            console.error(`Error closing all positions:`, error);
            return false;
        }
    }

    async closeAllPositionsForUser(user_uuid: string, symbols: string[]): Promise<any> {
        try {
            await Promise.all(symbols.map(symbol => this.closePosition(user_uuid, symbol)));
        } catch (error) {
            console.error(`Error closing all positions for user:`, error);
            return false;
        }
    }


    async cancelOrder(user_uuid: string, symbol: string, orderId: string): Promise<any> {
        try {
            const binanceClient = await BinanceClientManager.getClientForUser(user_uuid);
            console.log(`Cancelling order ${orderId} for ${symbol}`);
            return await binanceClient.futuresCancel(symbol, orderId);

        } catch (error) {
            throw new Error(`Failed to cancel order ${orderId} for ${symbol}: ${error}`);
        }
    }



    async cancelAllOrders(user_uuid: string, symbol?: string): Promise<any> {
        try {
            const binanceClient = await BinanceClientManager.getClientForUser(user_uuid);
            return symbol
                ? await binanceClient.futuresCancelAll(symbol)
                : await binanceClient.futuresCancelAll();
        } catch (error) {
            throw new Error(`Failed to cancel all orders: ${error}`);
        }
    }


}