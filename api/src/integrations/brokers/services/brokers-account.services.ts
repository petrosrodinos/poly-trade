import { BrokersClientManager } from "../brokers-client-manager";
import { ExchangeType } from "../interfaces/brokers.interfaces";
import { BrokerAccountInfo, BrokerIncome, BrokerIncomeTradesAndProfit, BrokerTrade, BrokerTradeAndProfit } from "../interfaces/brokers.interfaces";
import { BrokerAccountUtils } from "../utils/broker-account.utils";

export class BrokersAccountService {

    private brokerAccountUtils: BrokerAccountUtils;

    constructor() {
        this.brokerAccountUtils = new BrokerAccountUtils();
    }

    async getAccountFutures(user_uuid: string, type: ExchangeType): Promise<BrokerAccountInfo | null> {
        try {
            const brokerClient = await BrokersClientManager.getClientForUser(user_uuid, type);
            if (!brokerClient) {
                return null;
            }

            let accountInfo: any;

            if (type === 'BINANCE') {
                try {
                    accountInfo = await brokerClient.fetchBalance();
                } catch (error) {
                    console.warn(`fetchBalance failed for BINANCE: ${error}`);
                    if (brokerClient.has && brokerClient.has.fetchBalance) {
                        accountInfo = await brokerClient.fetchBalance();
                    } else {
                        throw new Error('fetchBalance method not available on BINANCE client');
                    }
                }
            } else if (type === 'ALPACA') {
                try {
                    accountInfo = await brokerClient.fetchBalance();
                } catch (error) {
                    console.warn(`fetchBalance failed for ALPACA: ${error}`);
                    if (brokerClient.has && brokerClient.has.fetchBalance) {
                        accountInfo = await brokerClient.fetchBalance();
                    } else {
                        throw new Error('fetchBalance method not available on ALPACA client');
                    }
                }
            } else if (type === 'COINBASE') {
                try {
                    accountInfo = await brokerClient.fetchBalance();
                } catch (error) {
                    console.warn(`fetchBalance failed for COINBASE: ${error}`);
                    accountInfo = { free: {}, used: {}, total: {} };
                }
            } else if (type === 'KRAKEN') {
                try {
                    accountInfo = await brokerClient.fetchBalance();
                } catch (error) {
                    console.warn(`fetchBalance failed for KRAKEN: ${error}`);
                    accountInfo = { free: {}, used: {}, total: {} };
                }
            } else {
                throw new Error(`Unsupported exchange type: ${type}`);
            }

            return this.normalizeAccountInfo(accountInfo, type);
        } catch (error) {
            console.error(`Failed to get futures account for ${type}: ${error}`);
            return null;
        }
    }

    async getFuturesUserTrades(user_uuid: string, type: ExchangeType, symbol?: string): Promise<BrokerTrade[]> {
        try {
            const brokerClient = await BrokersClientManager.getClientForUser(user_uuid, type);
            if (!brokerClient) {
                return [];
            }

            let trades: any[];

            if (type === 'BINANCE') {
                try {
                    if (!symbol) {
                        console.warn('No symbol provided for BINANCE fetchMyTrades, using default symbol BTCUSDT');
                        symbol = 'BTCUSDT';
                    }
                    trades = await brokerClient.fetchMyTrades(symbol);
                } catch (error) {
                    console.warn(`fetchMyTrades failed for BINANCE, trying alternative method: ${error}`);
                    if (brokerClient.has && brokerClient.has.fetchMyTrades) {
                        if (!symbol) {
                            symbol = 'BTCUSDT';
                        }
                        trades = await brokerClient.fetchMyTrades(symbol);
                    } else {
                        throw new Error('fetchMyTrades method not available on BINANCE client');
                    }
                }
            } else if (type === 'ALPACA') {
                try {
                    if (!symbol) {
                        console.warn('No symbol provided for ALPACA fetchMyTrades, using default symbol SPY');
                        symbol = 'SPY';
                    }
                    trades = await brokerClient.fetchMyTrades(symbol);
                } catch (error) {
                    console.warn(`fetchMyTrades failed for ALPACA, trying alternative method: ${error}`);
                    if (brokerClient.has && brokerClient.has.fetchMyTrades) {
                        if (!symbol) {
                            symbol = 'SPY';
                        }
                        trades = await brokerClient.fetchMyTrades(symbol);
                    } else {
                        throw new Error('fetchMyTrades method not available on ALPACA client');
                    }
                }
            } else if (type === 'COINBASE') {
                try {
                    if (!symbol) {
                        console.warn('No symbol provided for COINBASE fetchMyTrades, using default symbol BTC/USDT');
                        symbol = 'BTC/USDT';
                    }
                    trades = await brokerClient.fetchMyTrades(symbol);
                } catch (error) {
                    console.warn(`fetchMyTrades failed for COINBASE: ${error}`);
                    trades = [];
                }
            } else if (type === 'KRAKEN') {
                try {
                    if (!symbol) {
                        console.warn('No symbol provided for KRAKEN fetchMyTrades, using default symbol BTC/USDT');
                        symbol = 'BTC/USDT';
                    }
                    trades = await brokerClient.fetchMyTrades(symbol);
                } catch (error) {
                    console.warn(`fetchMyTrades failed for KRAKEN: ${error}`);
                    trades = [];
                }
            } else {
                throw new Error(`Unsupported exchange type: ${type}`);
            }

            const normalizedTrades = trades.map(trade => this.normalizeTrade(trade, type));
            return this.brokerAccountUtils.sortTrades(normalizedTrades);
        } catch (error) {
            console.error(`Failed to get futures user trades for ${type}: ${error}`);
            if (type === 'BINANCE' && !symbol) {
                console.error('BINANCE fetchMyTrades requires a symbol parameter. Consider providing a default symbol.');
            }
            return [];
        }
    }

    async futuresIncome(user_uuid: string, type: ExchangeType, symbol?: string): Promise<BrokerIncome[]> {
        try {
            const brokerClient = await BrokersClientManager.getClientForUser(user_uuid, type);
            let income: any[] = [];

            if (type === 'BINANCE') {
                try {
                    income = await brokerClient.fetchLedger();
                } catch (error) {
                    console.warn(`fetchLedger failed for BINANCE: ${error}`);
                    if (brokerClient.has && brokerClient.has.fetchLedger) {
                        income = await brokerClient.fetchLedger();
                    } else {
                        console.warn('fetchLedger method not available on BINANCE client, returning empty array');
                        income = [];
                    }
                }
            } else if (type === 'ALPACA') {
                try {
                    income = await brokerClient.fetchLedger();
                } catch (error) {
                    console.warn(`fetchLedger failed for ALPACA: ${error}`);
                    if (brokerClient.has && brokerClient.has.fetchLedger) {
                        income = await brokerClient.fetchLedger();
                    } else {
                        console.warn('fetchLedger method not available on ALPACA client, returning empty array');
                        income = [];
                    }
                }
            } else if (type === 'COINBASE') {
                try {
                    income = await brokerClient.fetchLedger();
                } catch (error) {
                    console.warn(`fetchLedger failed for COINBASE: ${error}`);
                    income = [];
                }
            } else if (type === 'KRAKEN') {
                try {
                    income = await brokerClient.fetchLedger();
                } catch (error) {
                    console.warn(`fetchLedger failed for KRAKEN: ${error}`);
                    income = [];
                }
            } else {
                throw new Error(`Unsupported exchange type: ${type}`);
            }

            if (!income || income.length === 0) {
                return [];
            }

            if (symbol) {
                income = income.filter((inc: any) => inc.symbol === symbol);
            }

            const normalizedIncome = income.map(inc => this.normalizeIncome(inc, type));
            return this.brokerAccountUtils.sortIncomes(normalizedIncome);
        } catch (error) {
            throw new Error(`Failed to get futures income for ${type}: ${error}`);
        }
    }

    async getAccountBalance(user_uuid: string, type: ExchangeType, symbol: string): Promise<number> {
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

            const profit = this.brokerAccountUtils.calculateIncomeSummary(incomes).netProfit;

            return {
                profit,
                income: incomes
            };
        } catch (error) {
            throw new Error(`Failed to get futures income and trades and profit for ${type}: ${error}`);
        }
    }

    async getFuturesUserTradesAndProfit(user_uuid: string, type: ExchangeType, symbol?: string): Promise<BrokerTradeAndProfit> {
        try {
            const trades = await this.getFuturesUserTrades(user_uuid, type, symbol);

            if (!trades || trades.length === 0) {
                return {
                    profit: 0,
                    trades: []
                };
            }

            const profit = this.brokerAccountUtils.calculateTradesSummary(trades).netProfit;
            return {
                profit,
                trades
            };
        } catch (error) {
            throw new Error(`Failed to get futures user trades and profit for ${type}: ${error}`);
        }
    }

    async ping(user_uuid: string, type: ExchangeType): Promise<any> {
        try {
            const brokerClient = await BrokersClientManager.getClientForUser(user_uuid, type);
            let response: any;

            if (type === 'BINANCE') {
                try {
                    response = await brokerClient.fetchTime();
                } catch (error) {
                    console.warn(`fetchTime failed for BINANCE: ${error}`);
                    response = { serverTime: Date.now() };
                }
            } else if (type === 'ALPACA') {
                try {
                    response = await brokerClient.fetchTime();
                } catch (error) {
                    console.warn(`fetchTime failed for ALPACA: ${error}`);
                    response = { serverTime: Date.now() };
                }
            } else if (type === 'COINBASE') {
                try {
                    response = await brokerClient.fetchTime();
                } catch (error) {
                    console.warn(`fetchTime failed for COINBASE: ${error}`);
                    response = { serverTime: Date.now() };
                }
            } else if (type === 'KRAKEN') {
                try {
                    response = await brokerClient.fetchTime();
                } catch (error) {
                    console.warn(`fetchTime failed for KRAKEN: ${error}`);
                    response = { serverTime: Date.now() };
                }
            } else {
                throw new Error(`Unsupported exchange type: ${type}`);
            }

            return response;
        } catch (error) {
            throw new Error(`Failed to ping ${type}: ${error}`);
        }
    }

    private normalizeAccountInfo(accountInfo: any, type: ExchangeType): BrokerAccountInfo {
        if (type === 'BINANCE') {
            return accountInfo;
        } else if (type === 'ALPACA') {
            return {
                totalInitialMargin: accountInfo.initial_margin || '0',
                totalMaintMargin: accountInfo.maintenance_margin || '0',
                totalWalletBalance: accountInfo.portfolio_value || '0',
                totalUnrealizedProfit: accountInfo.unrealized_pl || '0',
                totalMarginBalance: accountInfo.equity || '0',
                totalPositionInitialMargin: accountInfo.initial_margin || '0',
                totalOpenOrderInitialMargin: '0',
                totalCrossWalletBalance: accountInfo.cash || '0',
                totalCrossUnPnl: '0',
                availableBalance: accountInfo.buying_power || '0',
                maxWithdrawAmount: accountInfo.cash || '0',
                assets: [{
                    asset: accountInfo.currency || 'USD',
                    walletBalance: accountInfo.portfolio_value || '0',
                    unrealizedProfit: accountInfo.unrealized_pl || '0',
                    marginBalance: accountInfo.equity || '0',
                    maintMargin: accountInfo.maintenance_margin || '0',
                    initialMargin: accountInfo.initial_margin || '0',
                    positionInitialMargin: accountInfo.initial_margin || '0',
                    openOrderInitialMargin: '0',
                    crossWalletBalance: accountInfo.cash || '0',
                    crossUnPnl: '0',
                    availableBalance: accountInfo.buying_power || '0',
                    maxWithdrawAmount: accountInfo.cash || '0',
                    updateTime: Date.now()
                }]
            };
        } else {
            return {
                totalInitialMargin: '0',
                totalMaintMargin: '0',
                totalWalletBalance: '0',
                totalUnrealizedProfit: '0',
                totalMarginBalance: '0',
                totalPositionInitialMargin: '0',
                totalOpenOrderInitialMargin: '0',
                totalCrossWalletBalance: '0',
                totalCrossUnPnl: '0',
                availableBalance: '0',
                maxWithdrawAmount: '0',
                assets: []
            };
        }
    }

    private normalizeTrade(trade: any, type: ExchangeType): BrokerTrade {
        if (type === 'BINANCE') {
            return trade;
        } else {
            return {
                symbol: trade.symbol || trade.pair || '',
                id: trade.id || 0,
                orderId: trade.orderId || trade.order || 0,
                side: (trade.side || trade.type || '').toUpperCase() as 'BUY' | 'SELL',
                price: trade.price || '0',
                qty: trade.amount || trade.qty || '0',
                realizedPnl: trade.realizedPnl || '0',
                quoteQty: trade.cost || '0',
                commission: trade.fee?.cost || '0',
                commissionAsset: trade.fee?.currency || '',
                time: trade.timestamp || Date.now(),
                positionSide: 'BOTH',
                maker: trade.maker || false,
                buyer: trade.side === 'buy'
            };
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
