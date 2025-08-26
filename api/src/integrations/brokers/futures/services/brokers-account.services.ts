import { BrokersClientManager } from "../../brokers-client-manager";
import { ExchangeType } from "../interfaces/brokers-account.interfaces";
import { BrokerFuturesAccountInfo, BrokerIncome, BrokerIncomeTradesAndProfit, BrokerFuturesTrade, BrokerFuturesTradeAndProfit } from "../interfaces/brokers-account.interfaces";
import { BrokerFuturesAccountUtils } from "../utils/broker-account.utils";

export class BrokersFuturesAccountService {

    private brokerFuturesAccountUtils: BrokerFuturesAccountUtils;

    constructor() {
        this.brokerFuturesAccountUtils = new BrokerFuturesAccountUtils();
    }

    async getAccountFutures(
        user_uuid: string,
        type: ExchangeType
    ): Promise<BrokerFuturesAccountInfo | null> {
        try {
            const brokerClient: any = await BrokersClientManager.getClientForUser(user_uuid, type);
            if (!brokerClient) return null;

            let accountInfo: any;

            const accountType = type === 'MEXC' ? 'swap' : 'future';

            if (type === 'BINANCE' || type === 'MEXC') {
                brokerClient.options = brokerClient.options ?? {};
                if (brokerClient.options.defaultType !== 'future') {
                    brokerClient.options.defaultType = 'future';
                    if (typeof brokerClient.loadMarkets === 'function') {
                        await brokerClient.loadMarkets(true);
                    }
                }

                accountInfo = await brokerClient.fetchBalance({ type: accountType });

            } else {
                console.warn(`${type} futures not supported, returning empty balances.`);
                accountInfo = { free: {}, used: {}, total: {} };
            }

            return accountInfo.info;

        } catch (error) {
            console.error(`Failed to get futures account for ${type}: ${error}`);
            return null;
        }
    }

    async getFuturesUserTrades(
        user_uuid: string,
        type: ExchangeType,
        symbols: string[]
    ): Promise<BrokerFuturesTrade[]> {
        try {
            const brokerClient: any = await BrokersClientManager.getClientForUser(user_uuid, type);
            if (!brokerClient) return [];

            if (type === 'BINANCE') {
                brokerClient.options = brokerClient.options ?? {};
                brokerClient.options.defaultType = 'future';
            }

            await brokerClient.loadMarkets();

            const futuresSymbols = symbols.map((s) => s.replace('USDT', '/USDT') + ':USDT');

            const results = await Promise.allSettled(
                futuresSymbols.map((s) => brokerClient.fetchMyTrades(s))
            );

            const trades = results.map((r: any) => r.value).flat();

            const normalizedTrades = trades.map((trade) => this.brokerFuturesAccountUtils.normalizeTrade(trade));

            return this.brokerFuturesAccountUtils.sortTrades(normalizedTrades);

        } catch (error) {
            console.error(`Failed to get futures user trades for ${type}: ${error}`);
            return [];
        }
    }

    async futuresIncome(user_uuid: string, type: ExchangeType, symbol?: string): Promise<BrokerIncome[]> {
        try {
            const brokerClient = await BrokersClientManager.getClientForUser(user_uuid, type);

            if (!brokerClient) return [];

            let income: any[] = [];

            income = await brokerClient.fetchLedger();

            if (symbol) {
                income = income.filter((inc: any) => inc.symbol === symbol);
            }

            const normalizedIncome = income.map(inc => this.normalizeIncome(inc, type));
            return this.brokerFuturesAccountUtils.sortIncomes(normalizedIncome);
        } catch (error) {
            throw new Error(`Failed to get futures income for ${type}: ${error}`);
        }
    }

    async getAccountBalance(user_uuid: string, type: ExchangeType): Promise<number> {
        try {
            const account = await this.getAccountFutures(user_uuid, type);
            if (!account) {
                throw new Error('Unable to fetch account information');
            }

            return parseFloat(account.availableBalance);
        } catch (error) {
            throw new Error(`Failed to get account balance for ${type}: ${error}`);
        }
    }

    async getFuturesIncomeTradesAndProfit(user_uuid: string, type: ExchangeType, symbol?: string): Promise<BrokerIncomeTradesAndProfit> {
        try {
            let incomes = await this.futuresIncome(user_uuid, type, symbol);

            if (!incomes || incomes.length === 0) {
                return {
                    profit: 0,
                    income: []
                };
            }

            const profit = this.brokerFuturesAccountUtils.calculateIncomeSummary(incomes).netProfit;

            return {
                profit,
                income: incomes
            };
        } catch (error) {
            throw new Error(`Failed to get futures income and trades and profit for ${type}: ${error}`);
        }
    }

    async getFuturesUserTradesAndProfit(user_uuid: string, type: ExchangeType, symbol?: string): Promise<BrokerFuturesTradeAndProfit | null> {
        try {

            return null;
            // const trades = await this.getFuturesUserTrades(user_uuid, type, symbol);

            // if (!trades || trades.length === 0) {
            //     return {
            //         profit: 0,
            //         trades: []
            //     };
            // }

            // const profit = this.brokerFuturesAccountUtils.calculateTradesSummary(trades).netProfit;
            // return {
            //     profit,
            //     trades
            // };
        } catch (error) {
            throw new Error(`Failed to get futures user trades and profit for ${type}: ${error}`);
        }
    }

    async ping(user_uuid: string, type: ExchangeType): Promise<any> {
        try {
            const brokerClient = await BrokersClientManager.getClientForUser(user_uuid, type);
            let response: any;

            response = await brokerClient.fetchTime();

            return response;
        } catch (error) {
            throw new Error(`Failed to ping ${type}: ${error}`);
        }
    }


    private normalizeIncome(income: any, type: ExchangeType): BrokerIncome {
        if (type === 'BINANCE') {
            return income;
        } else {
            return {
                symbol: income.symbol || income.pair || '',
                incomeType: income.incomeType || income.type || 'REALIZED_PNL',
                income: income.income || income.amount || '0',
                asset: income.asset || income.currency || '',
                time: income.time || income.timestamp || Date.now(),
                info: income.info || '',
                tranId: income.tranId || income.id || 0,
                tradeId: income.tradeId || income.trade_id || ''
            };
        }
    }
}
