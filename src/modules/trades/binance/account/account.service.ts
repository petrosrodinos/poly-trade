import { BinanceAccountService } from "../../../../integrations/binance/services/binance-account.service";
import { AccountUtils } from "./account.utils";

export class BinanceAccountServiceClass {
    private binanceAccountService: BinanceAccountService;
    private accountUtils: AccountUtils;

    constructor() {
        this.binanceAccountService = new BinanceAccountService();
        this.accountUtils = new AccountUtils();
    }

    getAccount = async () => {
        try {
            const account = await this.getAccountFutures();
            const trades = await this.getFuturesUserTrades();
            const income = await this.getFuturesIncome();

            const { grossProfit, commission, netProfit } = this.accountUtils.calculateTotalProfit(trades);
            const incomeSummary = this.accountUtils.calculateIncomeSummary(income);

            return {
                balance: account.totalWalletBalance,
                grossProfit,
                commission,
                netProfit,
                trades: trades.length,
                income: incomeSummary,
            };
        } catch (error: any) {
            throw new Error(`Failed to get account status: ${error}`);
        }
    }

    getAccountFutures = async () => {
        try {
            const account = await this.binanceAccountService.getAccountFutures();
            return account;
        } catch (error: any) {
            throw new Error(`Failed to get account status: ${error}`);
        }
    }


    getFuturesUserTrades = async () => {
        try {
            const orders = await this.binanceAccountService.getFuturesUserTrades();
            return orders;
        } catch (error: any) {
            throw new Error(`Failed to get futures orders: ${error}`);
        }
    }


    getFuturesIncome = async () => {
        try {
            const income = await this.binanceAccountService.futuresIncome();
            return income;
        } catch (error: any) {
            throw new Error(`Failed to get futures income: ${error}`);
        }
    }


}