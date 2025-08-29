import { FuturesAccountInfo, FuturesTrade } from "../../integrations/binance/binance.interfaces";
import { AccountChartData, AccountSummary, Timeframe } from "./interfaces/account.interfaces";
import { BrokersFuturesAccountService } from "../../integrations/brokers/futures/services/brokers-account.services";
import { BrokerFuturesAccountUtils } from "../../integrations/brokers/futures/utils/broker-account.utils";
import { BotSubscriptionsService } from "../bot-subscriptions/bot-subscriptions.service";
import { Exchanges } from "../../integrations/brokers/futures/interfaces/brokers-account.interfaces";
import { BrokersFuturesTradesService } from "../../integrations/brokers/futures/services/brokers-trades.services";
import { BrokerFuturesOrder, BrokerFuturesPosition } from "../../integrations/brokers/futures/interfaces/brokers-trades.interfaces";


export class AccountService {
    private brokersFuturesAccountService: BrokersFuturesAccountService;
    private brokersFuturesAccountUtils: BrokerFuturesAccountUtils;
    private botbscriptionService: BotSubscriptionsService;
    private brokersFuturesTradesService: BrokersFuturesTradesService;

    constructor() {
        this.brokersFuturesAccountService = new BrokersFuturesAccountService();
        this.brokersFuturesAccountUtils = new BrokerFuturesAccountUtils();
        this.botbscriptionService = new BotSubscriptionsService();
        this.brokersFuturesTradesService = new BrokersFuturesTradesService();
    }

    getAccount = async (user_uuid: string): Promise<AccountSummary> => {
        try {

            const subscriptions = await this.botbscriptionService.getUserBotSubscriptions(user_uuid);

            const symbols = subscriptions.map((subscription: any) => subscription.bot.symbol);

            const [account, trades] = await Promise.all([
                this.getAccountFutures(user_uuid),
                this.getFuturesUserTrades(user_uuid, symbols)
                // this.getFuturesIncome()
            ]);

            const tradesSummary = this.brokersFuturesAccountUtils.calculateTradesSummary(trades);
            // const incomeSummary = this.accountUtils.calculateIncomeSummary(income);

            return {
                totalWalletBalance: parseFloat(account?.totalWalletBalance ?? '0'),
                availableBalance: parseFloat(account?.availableBalance ?? '0'),
                income: tradesSummary,
                // trades: tradesSummary,
            };
        } catch (error: any) {
            throw new Error(`Failed to get account status: ${error}`);
        }
    }


    getAccountFutures = async (user_uuid: string): Promise<FuturesAccountInfo | null> => {
        try {
            const account = await this.brokersFuturesAccountService.getAccountFutures(user_uuid, Exchanges.DEFAULT);
            return account;
        } catch (error: any) {
            throw new Error(`Failed to get account status: ${error}`);
        }
    }


    getFuturesUserTrades = async (user_uuid: string, symbols: string[]): Promise<FuturesTrade[]> => {
        try {
            const trades = await this.brokersFuturesAccountService.getFuturesUserTrades(user_uuid, Exchanges.DEFAULT, symbols);
            return trades;
        } catch (error: any) {
            throw new Error(`Failed to get futures orders: ${error}`);
        }
    }


    // getFuturesIncome = async (user_uuid: string, symbol?: string): Promise<FuturesIncome[]> => {
    //     try {
    //         const income = await this.binanceAccountService.futuresIncome(user_uuid, symbol);
    //         return income;
    //     } catch (error: any) {
    //         throw new Error(`Failed to get futures income: ${error}`);
    //     }
    // }


    // getAccountIncomeChart = async (user_uuid: string, timeframe: Timeframe): Promise<AccountChartData[]> => {
    //     try {
    //         const income = await this.getFuturesIncome(user_uuid);
    //         const reversedIncome = income.reverse();
    //         const incomeChart = this.accountUtils.calculateIncomeChart(reversedIncome, timeframe);
    //         return incomeChart
    //     } catch (error: any) {
    //         throw new Error(`Failed to get account income chart: ${error}`);
    //     }
    // }

    getAccountTradesChart = async (user_uuid: string, timeframe: Timeframe): Promise<AccountChartData[]> => {
        try {
            const subscriptions = await this.botbscriptionService.getUserBotSubscriptions(user_uuid);

            const symbols = subscriptions.map((subscription: any) => subscription.bot.symbol);

            const trades = await this.getFuturesUserTrades(user_uuid, symbols);
            const reversedTrades = trades.reverse();
            const incomeChart = this.brokersFuturesAccountUtils.calculateTradesChart(reversedTrades, timeframe);
            return incomeChart;

        } catch (error: any) {
            throw new Error(`Failed to get account income chart: ${error}`);
        }
    }

    ping = async (user_uuid: string): Promise<{ message: string; response: any; timestamp: string }> => {
        try {
            const response = await this.brokersFuturesAccountService.ping(user_uuid, Exchanges.DEFAULT);
            return {
                message: 'pong',
                response,
                timestamp: new Date().toISOString()
            };
        } catch (error: any) {
            throw new Error(`Failed to ping Binance: ${error}`);
        }
    }

    getPosition = async (user_uuid: string, symbol: string): Promise<BrokerFuturesPosition | null> => {
        try {
            const position = await this.brokersFuturesTradesService.getPosition(user_uuid, symbol, Exchanges.DEFAULT);
            return position;
        } catch (error: any) {
            throw new Error(`Failed to get position: ${error}`);
        }
    }

    openPosition = async (user_uuid: string, symbol: string, side: 'buy' | 'sell', quantity: number, leverage?: number): Promise<BrokerFuturesOrder | null> => {

        try {
            const position = await this.brokersFuturesTradesService.openPosition(user_uuid, Exchanges.DEFAULT, symbol, side, quantity, leverage);
            return position;
        } catch (error: any) {
            throw new Error(`Failed to open position: ${error}`);
        }
    }

    closePosition = async (user_uuid: string, symbol: string): Promise<BrokerFuturesOrder | null> => {
        try {
            const position = await this.brokersFuturesTradesService.closePosition(user_uuid, Exchanges.DEFAULT, symbol);
            return position;
        } catch (error: any) {
            throw new Error(`Failed to close position: ${error}`);
        }
    }

}