import { FuturesAccountInfo, FuturesIncome, FuturesTrade } from "../../integrations/binance/binance.interfaces";
import { BinanceAccountService } from "../../integrations/binance/services/binance-account.service";
import { AccountChartData, AccountSummary, Timeframe } from "./interfaces/account.interfaces";
import { AccountUtils } from "../../integrations/binance/utils/account.utils";


export class BinanceAccountServiceClass {
    private binanceAccountService: BinanceAccountService;
    private accountUtils: AccountUtils;

    constructor() {
        this.binanceAccountService = new BinanceAccountService();
        this.accountUtils = new AccountUtils();
    }

    getAccount = async (user_uuid: string): Promise<AccountSummary> => {
        try {
            const account = await this.getAccountFutures(user_uuid);
            const trades = await this.getFuturesUserTrades(user_uuid);
            // const income = await this.getFuturesIncome();

            const tradesSummary = this.accountUtils.calculateTradesSummary(trades);
            // const incomeSummary = this.accountUtils.calculateIncomeSummary(income);


            return {
                totalWalletBalance: parseFloat(account.totalWalletBalance),
                availableBalance: parseFloat(account.availableBalance),
                // trades: incomeSummary,
                income: tradesSummary,
            };
        } catch (error: any) {
            throw new Error(`Failed to get account status: ${error}`);
        }
    }


    getAccountFutures = async (user_uuid: string): Promise<FuturesAccountInfo> => {
        try {
            const account = await this.binanceAccountService.getAccountFutures(user_uuid);
            return account;
        } catch (error: any) {
            throw new Error(`Failed to get account status: ${error}`);
        }
    }


    getFuturesUserTrades = async (user_uuid: string, symbol?: string): Promise<FuturesTrade[]> => {
        try {
            const orders = await this.binanceAccountService.getFuturesUserTrades(user_uuid, symbol);
            return orders;
        } catch (error: any) {
            throw new Error(`Failed to get futures orders: ${error}`);
        }
    }


    getFuturesIncome = async (user_uuid: string, symbol?: string): Promise<FuturesIncome[]> => {
        try {
            const income = await this.binanceAccountService.futuresIncome(user_uuid, symbol);
            return income;
        } catch (error: any) {
            throw new Error(`Failed to get futures income: ${error}`);
        }
    }


    getAccountIncomeChart = async (user_uuid: string, timeframe: Timeframe): Promise<AccountChartData[]> => {
        try {
            const income = await this.getFuturesIncome(user_uuid);
            const reversedIncome = income.reverse();
            const incomeChart = this.accountUtils.calculateIncomeChart(reversedIncome, timeframe);
            return incomeChart
        } catch (error: any) {
            throw new Error(`Failed to get account income chart: ${error}`);
        }
    }

    getAccountTradesChart = async (user_uuid: string, timeframe: Timeframe): Promise<AccountChartData[]> => {
        try {
            const trades = await this.getFuturesUserTrades(user_uuid);
            const reversedTrades = trades.reverse();
            const incomeChart = this.accountUtils.calculateTradesChart(reversedTrades, timeframe);
            return incomeChart
        } catch (error: any) {
            throw new Error(`Failed to get account income chart: ${error}`);
        }
    }

    ping = async (user_uuid: string): Promise<{ message: string; response: any; timestamp: string }> => {
        try {
            const response = await this.binanceAccountService.ping(user_uuid);
            return {
                message: 'pong',
                response,
                timestamp: new Date().toISOString()
            };
        } catch (error: any) {
            throw new Error(`Failed to ping Binance: ${error}`);
        }
    }

}