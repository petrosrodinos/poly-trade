import { BinanceClient } from "../binance.client";
import { FuturesAccountInfo, FuturesIncome, FuturesIncomeTradesAndProfit, FuturesTrade, FuturesTradeAndProfit } from "../binance.interfaces";
import { AccountUtils } from "../utils/account.utils";

export class BinanceAccountService {

    private binanceClient: any;
    private accountUtils: AccountUtils;


    constructor() {
        this.binanceClient = BinanceClient.getClient();
        this.accountUtils = new AccountUtils();

    }

    async getAccountFutures(): Promise<FuturesAccountInfo> {
        try {
            const accountInfo = await this.binanceClient.futuresAccount();
            return accountInfo;
        } catch (error) {
            throw new Error(`Failed to get futures account: ${error}`);
        }
    }


    async getFuturesUserTrades(symbol?: string): Promise<FuturesTrade[]> {
        try {
            const trades = await this.binanceClient.futuresUserTrades(symbol);
            return trades;
        } catch (error) {
            throw new Error(`Failed to get futures user trades: ${error}`);
        }
    }

    async futuresIncome(symbol?: string): Promise<FuturesIncome[]> {
        try {

            let income = await this.binanceClient.futuresIncome();

            if (income.length === 0) {
                return []
            }

            if (symbol) {
                income = income.filter((income: FuturesIncome) => income.symbol === symbol);
            }

            return income;
        } catch (error) {
            throw new Error(`Failed to get futures income: ${error}`);
        }
    }

    async getFuturesIncomeTradesAndProfit(symbol?: string): Promise<FuturesIncomeTradesAndProfit> {
        try {
            let incomes = await this.binanceClient.futuresIncome();

            if (incomes.length === 0) {
                return {
                    profit: 0,
                    income: []
                }
            }

            if (symbol) {
                incomes = incomes.filter((income: FuturesIncome) => income.symbol === symbol);
            }

            const profit = this.accountUtils.calculateIncomeSummary(incomes).netProfit;

            return {
                profit,
                income: incomes
            }
        } catch (error) {
            throw new Error(`Failed to get futures income and trades and profit: ${error}`);
        }
    }

    async getFuturesUserTradesAndProfit(symbol?: string): Promise<FuturesTradeAndProfit> {
        try {
            const trades = await this.binanceClient.futuresUserTrades(symbol);

            if (trades.length === 0) {
                return {
                    profit: 0,
                    trades: []
                }
            }

            const profit = this.accountUtils.calculateTotalProfit(trades).netProfit;
            return {
                profit,
                trades
            }
        } catch (error) {
            throw new Error(`Failed to get futures user trades and profit: ${error}`);
        }
    }

}