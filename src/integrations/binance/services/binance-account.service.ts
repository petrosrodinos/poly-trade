import { BinanceClient } from "../binance.client";
import { BinanceAccount, FuturesAccountInfo, FuturesBalanceEntry } from "../binance.interfaces";

export class BinanceAccountService {

    private binanceClient: any;

    constructor() {
        this.binanceClient = BinanceClient.getClient();
    }

    async getAccount(): Promise<BinanceAccount> {
        try {
            const accountInfo = await this.binanceClient.account();

            // console.log('accountInfo', accountInfo);

            return {
                id: accountInfo.accountId || 'N/A',
                status: accountInfo.canTrade ? 'ACTIVE' : 'INACTIVE',
                buying_power: accountInfo.totalWalletBalance || '0',
                cash: accountInfo.availableBalance || '0',
                portfolio_value: accountInfo.totalWalletBalance || '0',
                balances: accountInfo.balances || []
            };
        } catch (error) {
            console.error('Error getting Binance account:', error);
            throw new Error(`Failed to get account information: ${error}`);
        }
    }

    async getAccountFutures(): Promise<FuturesAccountInfo> {
        const accountInfo = await this.binanceClient.futuresAccount();
        return accountInfo;
    }

    async getAccountFuturesBalance(): Promise<FuturesBalanceEntry[]> {
        const accountInfo = await this.binanceClient.futuresBalance();
        return accountInfo;
    }


    async getFuturesUserTrades(symbol?: string): Promise<any> {
        const trades = await this.binanceClient.futuresUserTrades(symbol);
        return trades;
    }



}