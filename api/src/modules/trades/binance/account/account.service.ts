import { FuturesAccountInfo, FuturesIncome, FuturesTrade } from "@/integrations/binance/binance.interfaces";
import { BinanceAccountService } from "../../../../integrations/binance/services/binance-account.service";
import { AccountChartData, AccountSummary, Timeframe } from "./account.interfaces";
import { AccountUtils } from "../../../../integrations/binance/utils/account.utils";


export class BinanceAccountServiceClass {
    private binanceAccountService: BinanceAccountService;
    private accountUtils: AccountUtils;

    constructor() {
        this.binanceAccountService = new BinanceAccountService();
        this.accountUtils = new AccountUtils();
    }

    getAccount = async (): Promise<AccountSummary> => {
        try {
            const account = await this.getAccountFutures();
            const trades = await this.getFuturesUserTrades();
            const income = await this.getFuturesIncome();

            const tradesSummary = this.accountUtils.calculateTotalProfit(trades);
            const incomeSummary = this.accountUtils.calculateIncomeSummary(income);


            return {
                totalWalletBalance: parseFloat(account.totalWalletBalance),
                availableBalance: parseFloat(account.availableBalance),
                trades: incomeSummary,
                income: tradesSummary,
            };
        } catch (error: any) {
            throw new Error(`Failed to get account status: ${error}`);
        }
    }


    getAccountFutures = async (): Promise<FuturesAccountInfo> => {
        try {
            const account = await this.binanceAccountService.getAccountFutures();
            return account;
        } catch (error: any) {
            throw new Error(`Failed to get account status: ${error}`);
        }
    }


    getFuturesUserTrades = async (symbol?: string): Promise<FuturesTrade[]> => {
        try {
            const orders = await this.binanceAccountService.getFuturesUserTrades(symbol);
            return orders;
        } catch (error: any) {
            throw new Error(`Failed to get futures orders: ${error}`);
        }
    }


    getFuturesIncome = async (symbol?: string): Promise<FuturesIncome[]> => {
        try {
            const income = await this.binanceAccountService.futuresIncome(symbol);
            return income;
        } catch (error: any) {
            throw new Error(`Failed to get futures income: ${error}`);
        }
    }


    getAccountIncomeChart = async (timeframe: Timeframe): Promise<AccountChartData[]> => {
        try {
            const income = await this.getFuturesIncome();
            const reversedIncome = income.reverse();
            const incomeChart = this.accountUtils.calculateIncomeChart(reversedIncome, timeframe);
            return incomeChart
        } catch (error: any) {
            throw new Error(`Failed to get account income chart: ${error}`);
        }
    }

    getAccountTradesChart = async (timeframe: Timeframe): Promise<AccountChartData[]> => {
        try {
            const trades = await this.getFuturesUserTrades();
            const reversedTrades = trades.reverse();
            const incomeChart = this.accountUtils.calculateTradesChart(reversedTrades, timeframe);
            return incomeChart
        } catch (error: any) {
            throw new Error(`Failed to get account income chart: ${error}`);
        }
    }

}