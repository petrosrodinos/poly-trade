import { logger } from "../../../../shared/utils/logger";
import { BrokersClientManager } from "../../brokers-client-manager";
import { ExchangeType } from "../interfaces/brokers-account.interfaces";
import { BrokerFuturesOrder, BrokerFuturesOrderSide, BrokerFuturesPosition, BrokerFuturesPositionSide } from "../interfaces/brokers-trades.interfaces";
import { BrokerFuturesTradesUtils } from "../utils/broker-trades.utils";
import { TradesConfig } from "../../../../shared/constants/trades";
import { BrokerClient } from "../../interfaces/brokers.interfaces";

export class BrokersFuturesTradesService {

    private brokerfuturesTradesUtils: BrokerFuturesTradesUtils;

    constructor() {
        this.brokerfuturesTradesUtils = new BrokerFuturesTradesUtils();
    }

    async getPosition(
        user_uuid: string,
        symbol: string,
        type: ExchangeType
    ): Promise<BrokerFuturesPosition | null> {
        try {
            const brokerClient: any = await BrokersClientManager.getClientForUser(user_uuid, type);
            if (!brokerClient) return null;

            const formattedSymbol = symbol.replace('USDT', '/USDT') + ':USDT';

            await brokerClient.loadMarkets();

            const positions = await brokerClient.fetchPositions([formattedSymbol]);

            const pos = positions.find((p: any) => p.symbol === formattedSymbol);

            if (!pos || !pos.contracts || pos.contracts === 0) {
                return null;
            }

            return {
                symbol: pos.symbol,
                positionAmt: pos.contracts.toString(),
                entryPrice: pos.entryPrice?.toString() ?? '0',
                markPrice: pos.markPrice?.toString() ?? '0',
                unRealizedProfit: pos.unrealizedPnl?.toString() ?? '0',
                positionSide: pos.side.toUpperCase() as BrokerFuturesPositionSide
            };
        } catch (error: any) {
            console.error(`Error getting position for ${symbol}:`, error);

            return null;
        }
    }


    async openPosition(
        user_uuid: string,
        type: ExchangeType,
        symbol: string,
        side: 'buy' | 'sell',
        quantity?: number,
        leverage?: number
    ): Promise<BrokerFuturesOrder | null> {
        try {
            const brokerClient: any = await BrokersClientManager.getClientForUser(user_uuid, type);
            if (!brokerClient) return null;

            const formattedSymbol = symbol.replace('USDT', '/USDT') + ':USDT';

            const leverageValue = leverage || TradesConfig.leverage;

            await brokerClient.loadMarkets();

            await brokerClient.setLeverage(leverageValue, formattedSymbol);

            const order = await brokerClient.createOrder(
                formattedSymbol,
                'market',
                side,
                quantity,
                undefined,
                { type: 'future' }
            );

            logger.info(
                `Opened ${side.toUpperCase()} position for ${symbol} with quantity ${quantity} and leverage ${leverageValue}`
            );

            return {
                symbol: order.symbol,
                orderId: order.id,
                clientOrderId: order.clientOrderId ?? '',
                transactTime: order.timestamp ?? Date.now(),
                origQty: order.amount,
                executedQty: order.filled,
                status: order.status,
                timeInForce: order.timeInForce ?? 'GTC',
                type: order.type,
                side: order.side.toUpperCase() as BrokerFuturesOrderSide
            };
        } catch (error) {
            console.error(`Error opening ${side} position for ${symbol}:`, error);
            return null;
        }
    }


    async closePosition(
        user_uuid: string,
        type: ExchangeType,
        symbol: string
    ): Promise<BrokerFuturesOrder | null> {
        try {
            const brokerClient: any = await BrokersClientManager.getClientForUser(user_uuid, type);
            if (!brokerClient) return null;

            await brokerClient.loadMarkets();

            const formattedSymbol = symbol.replace('USDT', '/USDT') + ':USDT';

            const position = await this.getPosition(user_uuid, symbol, type);
            if (!position || parseFloat(position.positionAmt) === 0) {
                return null;
            }

            const positionAmount = parseFloat(position.positionAmt);
            const quantity = Math.abs(positionAmount);

            logger.info(
                `Closing ${positionAmount > 0 ? 'LONG' : 'SHORT'} for ${symbol} with quantity ${quantity}`
            );

            let order;
            if (positionAmount > 0) {
                order = await brokerClient.createOrder(
                    formattedSymbol,
                    'market',
                    'sell',
                    quantity,
                    undefined,
                    { type: 'future', reduceOnly: true }
                );
            } else if (positionAmount < 0) {
                order = await brokerClient.createOrder(
                    formattedSymbol,
                    'market',
                    'buy',
                    quantity,
                    undefined,
                    { type: 'future', reduceOnly: true }
                );
            }

            for (let retries = 0; retries < 15; retries++) {
                const pos = await this.getPosition(user_uuid, symbol, type);
                if (!pos || parseFloat(pos.positionAmt) === 0) {
                    break;
                }
                await new Promise((res) => setTimeout(res, 200));
            }

            return {
                symbol: order.symbol,
                orderId: order.id,
                clientOrderId: order.clientOrderId ?? '',
                transactTime: order.timestamp ?? Date.now(),
                origQty: order.amount,
                executedQty: order.filled,
                status: order.status,
                timeInForce: order.timeInForce ?? 'GTC',
                type: order.type,
                side: order.side.toUpperCase() as BrokerFuturesOrderSide,
            };
        } catch (error) {
            console.error(`Error closing position for ${symbol}:`, error);
            return null;
        }
    }



    async closeAllPositions(symbols: string[]): Promise<boolean> {
        try {
            const brokerClients: any = BrokersClientManager.getClients();
            if (!brokerClients || Object.keys(brokerClients).length === 0) return false;

            for (const [user_uuid, client] of Object.entries(brokerClients) as [string, BrokerClient][]) {
                await Promise.all(symbols.map(symbol => this.closePosition(user_uuid, client.type as ExchangeType, symbol)));
            }

            return true;

        } catch (error) {
            console.error(`Error closing all positions:`, error);
            return false;
        }
    }

    async closeAllPositionsForUser(user_uuid: string, type: ExchangeType, symbols: string[]): Promise<boolean> {
        try {
            await Promise.all(symbols.map(symbol => this.closePosition(user_uuid, type, symbol)));
            return true;
        } catch (error) {
            console.error(`Error closing all positions for user:`, error);
            return false;
        }
    }

}