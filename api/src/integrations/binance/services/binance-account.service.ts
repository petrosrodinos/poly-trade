import { BinanceClientManager } from "../binance-client-manager";
import { FuturesAccountInfo, FuturesIncome, FuturesIncomeTradesAndProfit, FuturesTrade, FuturesTradeAndProfit } from "../binance.interfaces";
import { AccountUtils } from "../utils/account.utils";

export class BinanceAccountService {

    private accountUtils: AccountUtils;


    constructor() {
        this.accountUtils = new AccountUtils();

    }

    async getAccountFutures(user_uuid: string): Promise<FuturesAccountInfo> {
        try {
            const binanceClient = await BinanceClientManager.getClientForUser(user_uuid);
            const accountInfo = await binanceClient.futuresAccount();
            return accountInfo;
        } catch (error) {
            throw new Error(`Failed to get futures account: ${error}`);
        }
    }


    async getFuturesUserTrades(user_uuid: string, symbol?: string): Promise<FuturesTrade[]> {
        try {
            const binanceClient = await BinanceClientManager.getClientForUser(user_uuid);
            const trades = await binanceClient.futuresUserTrades(symbol);
            return this.accountUtils.sortTrades(trades);
        } catch (error) {
            throw new Error(`Failed to get futures user trades: ${error}`);
        }
    }

    async futuresIncome(user_uuid: string, symbol?: string): Promise<FuturesIncome[]> {
        try {

            const binanceClient = await BinanceClientManager.getClientForUser(user_uuid);
            let income = await binanceClient.futuresIncome();

            if (!income || income.length === 0) {
                return []
            }

            if (symbol) {
                income = income.filter((income: FuturesIncome) => income.symbol === symbol);
            }

            return this.accountUtils.sortIncomes(income);
        } catch (error) {
            throw new Error(`Failed to get futures income: ${error}`);
        }
    }

    async getAccountBalance(user_uuid: string, symbol: string): Promise<number> {
        try {
            const account = await this.getAccountFutures(user_uuid);
            if (!account) {
                throw new Error('Unable to fetch account information');
            }

            return parseFloat(account.availableBalance);

            // const balance = parseFloat(account.assets.find((asset: any) => asset.asset === symbol)?.walletBalance || '0');

            // return balance;

        } catch (error) {
            throw new Error(`Failed to get account balance: ${error}`);
        }
    }

    async getFuturesIncomeTradesAndProfit(user_uuid: string, symbol?: string): Promise<FuturesIncomeTradesAndProfit> {
        try {
            let incomes = await this.futuresIncome(user_uuid, symbol);

            if (!incomes || incomes.length === 0) {
                return {
                    profit: 0,
                    income: []
                }
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

    async getFuturesUserTradesAndProfit(user_uuid: string, symbol?: string): Promise<FuturesTradeAndProfit> {
        try {
            const trades = await this.getFuturesUserTrades(user_uuid, symbol);

            if (!trades || trades.length === 0) {
                return {
                    profit: 0,
                    trades: []
                }
            }

            const profit = this.accountUtils.calculateTradesSummary(trades).netProfit;
            return {
                profit,
                trades
            }
        } catch (error) {
            throw new Error(`Failed to get futures user trades and profit: ${error}`);
        }
    }

    async ping(user_uuid: string): Promise<any> {
        try {
            const binanceClient = await BinanceClientManager.getClientForUser(user_uuid);
            const response = await binanceClient.futuresPing();
            return response;
        } catch (error) {
            throw new Error(`Failed to ping Binance: ${error}`);
        }
    }

}