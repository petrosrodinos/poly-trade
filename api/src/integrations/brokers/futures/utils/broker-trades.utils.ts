import { BinanceExchangeInfo, TradeQuantity } from "../../../binance/binance.interfaces";
import { BinanceClientManager } from "../../../binance/binance-client-manager";

export class BrokerFuturesTradesUtils {

    constructor() {
    }

    async getTradeQuantity(user_uuid: string, symbol: string, amount: number): Promise<TradeQuantity> {

        const price = await this.getFuturesPrices(user_uuid, symbol);

        const { minQty, stepSize } = await this.getExchangeInfo(user_uuid, symbol);

        const quantityValue = this.calculateQuantity(amount, price || 0, minQty, stepSize);

        return {
            quantity: quantityValue,
            price: price || 0,
            minQty: minQty,
            stepSize: stepSize
        }
    }

    async getExchangeInfo(user_uuid: string, symbol: string): Promise<BinanceExchangeInfo> {
        try {
            const binanceClient = await BinanceClientManager.getClientForUser(user_uuid);
            const info = await binanceClient.futuresExchangeInfo();
            const symbolInfo = info.symbols.find((s: any) => s.symbol === symbol);
            const lotSizeFilter = symbolInfo.filters.find((f: any) => f.filterType === "LOT_SIZE");

            return {
                minQty: parseFloat(lotSizeFilter.minQty),
                stepSize: parseFloat(lotSizeFilter.stepSize)
            };
        } catch (error) {
            throw new Error(`Failed to get exchange info for ${symbol}: ${error}`);
        }
    }

    async getFuturesPrices(user_uuid: string, symbol: string): Promise<number | null> {
        try {
            const binanceClient = await BinanceClientManager.getClientForUser(user_uuid);
            const prices = await binanceClient.futuresPrices();
            return parseFloat(prices?.[symbol] || 0);
        } catch (error) {
            throw new Error(`Failed to get futures prices for ${symbol}: ${error}`);
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