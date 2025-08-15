import { TradesConfig } from "../../../shared/constants/trades";
import { BinanceClient } from "../binance.client";
import { BinancePosition, BinanceOrderResponse, BinanceOrderSide } from "../binance.interfaces";
import { logger } from "../../../shared/utils/logger";

export class BinanceTradesService {
    private binanceClient: any;

    constructor() {
        this.binanceClient = BinanceClient.getClient();
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
                throw new Error(`API authentication failed. Please check your Binance API credentials and permissions.`);
            }

            throw new Error(`Failed to get position for ${symbol}: ${error.message || error}`);
        }
    }

    async openPosition(symbol: string, side: 'buy' | 'sell', price: number, quantity?: number, leverage?: number): Promise<BinanceOrderResponse> {
        try {
            const orderSide: BinanceOrderSide = side.toUpperCase() as BinanceOrderSide;

            let order;

            const leverageValue = leverage || TradesConfig.leverage;

            await this.binanceClient.futuresLeverage(symbol, leverageValue);

            if (orderSide === 'BUY') {
                order = await this.binanceClient.futuresMarketBuy(symbol, quantity);
            } else {
                order = await this.binanceClient.futuresMarketSell(symbol, quantity);
            }


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
                order = await this.binanceClient.futuresMarketSell(symbol, quantity);
            } else if (positionAmount < 0) {
                // Short → Close with buy
                order = await this.binanceClient.futuresMarketBuy(symbol, quantity);
            }

            // Wait until Binance confirms positionAmt = 0
            for (let retries = 0; retries < 15; retries++) { // max ~3 seconds
                const pos = await this.getPosition(symbol);
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


    async cancelOrder(symbol: string, orderId: string): Promise<any> {
        try {
            console.log(`Cancelling order ${orderId} for ${symbol}`);
            return await this.binanceClient.futuresCancel(symbol, orderId);

        } catch (error) {
            throw new Error(`Failed to cancel order ${orderId} for ${symbol}: ${error}`);
        }
    }



    async cancelAllOrders(symbol?: string): Promise<any> {
        try {
            return symbol
                ? await this.binanceClient.futuresCancelAll(symbol)
                : await this.binanceClient.futuresCancelAll();
        } catch (error) {
            throw new Error(`Failed to cancel all orders: ${error}`);
        }
    }


}