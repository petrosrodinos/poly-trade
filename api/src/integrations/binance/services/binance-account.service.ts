import { BinanceClient } from "../binance.client";
import { FuturesAccountInfo, FuturesIncome, FuturesTrade } from "../binance.interfaces";

export class BinanceAccountService {

    private binanceClient: any;

    constructor() {
        this.binanceClient = BinanceClient.getClient();
    }


    async getAccountFutures(): Promise<FuturesAccountInfo> {
        const accountInfo = await this.binanceClient.futuresAccount();
        return accountInfo;
    }


    async getFuturesUserTrades(symbol?: string): Promise<FuturesTrade[]> {
        const trades = await this.binanceClient.futuresUserTrades(symbol);
        return trades;
    }

    async futuresIncome(symbol?: string): Promise<FuturesIncome[]> {
        try {

            let income = await this.binanceClient.futuresIncome();

            if (symbol) {
                income = income.filter((income: FuturesIncome) => income.symbol === symbol);
            }

            return income;
        } catch (error) {
            throw new Error(`Failed to get futures income: ${error}`);
        }
    }

}