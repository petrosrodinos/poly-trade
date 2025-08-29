import { TradeQuantity } from "../../../binance/binance.interfaces";
import { ExchangeType } from "../interfaces/brokers-account.interfaces";
import { BrokersClientManager } from "../../brokers-client-manager";

export class BrokerFuturesTradesUtils {

    constructor() {
    }

    async getTradeQuantity(user_uuid: string, type: ExchangeType, symbol: string, amount: number): Promise<TradeQuantity> {

        const price = await this.getFuturesPrices(user_uuid, type, symbol);

        const { minQty, stepSize } = await this.getExchangeInfo(user_uuid, type, symbol);

        const quantityValue = this.calculateQuantity(amount, price || 0, minQty, stepSize);

        return {
            quantity: quantityValue,
            price: price || 0,
            minQty: minQty,
            stepSize: stepSize
        }
    }

    async getExchangeInfo(user_uuid: string, type: ExchangeType, symbol: string): Promise<{ minQty: number; stepSize: number }> {
        try {
            const brokerClient: any = await BrokersClientManager.getClientForUser(user_uuid, type);
            if (!brokerClient) throw new Error("No broker client found");

            await brokerClient.loadMarkets();

            const formattedSymbol = symbol.replace('USDT', '/USDT') + ':USDT';

            const market = brokerClient.market(formattedSymbol);

            if (!market || !market.limits) {
                throw new Error(`No market info found for ${symbol}`);
            }

            return {
                minQty: market.limits.amount?.min ?? 0,
                stepSize: market.precision.amount ?? 0
            };
        } catch (error) {
            throw new Error(`Failed to get exchange info for ${symbol}: ${error}`);
        }
    }

    async getFuturesPrices(user_uuid: string, type: ExchangeType, symbol: string): Promise<number | null> {
        try {
            const brokerClient: any = await BrokersClientManager.getClientForUser(user_uuid, type);
            if (!brokerClient) return null;

            await brokerClient.loadMarkets();

            const formattedSymbol = symbol.replace('USDT', '/USDT') + ':USDT';

            const ticker = await brokerClient.fetchTicker(formattedSymbol);

            return ticker.last ?? null;
        } catch (error) {
            throw new Error(`Failed to get futures price for ${symbol}: ${error}`);
        }
    }

    calculateQuantity(amount: number, price: number, minQty: number, stepSize: number) {

        let qty = amount / price;

        // If below minimum, set to 0 to skip
        if (qty < minQty) {
            return 0;
        }

        // Adjust to step size (truncate to valid increment)
        qty = Math.floor(qty / stepSize) * stepSize;

        // Ensure proper decimal precision
        return parseFloat(qty.toFixed(8));
    }

}