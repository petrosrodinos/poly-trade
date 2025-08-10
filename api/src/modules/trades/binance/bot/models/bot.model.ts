import { FuturesIncome, FuturesTrade } from "@/integrations/binance/binance.interfaces";

export class BotModel {
    id: string;
    symbol: string;
    amount: number;
    interval: string;
    leverage: number;
    active: boolean;
    quantity?: number;
    trades?: FuturesTrade[];
    income?: FuturesIncome[];
    profit?: number;
    created_at: string;

    constructor(bot: BotModel) {
        this.id = bot.id;
        this.symbol = bot.symbol;
        this.amount = bot.amount;
        this.interval = bot.interval || '1m';
        this.leverage = bot.leverage || 1;
        this.active = bot.active || true;
        this.profit = bot.profit || 0;
        // this.income = bot.income || [];
        this.trades = bot.trades || [];
        this.quantity = bot.quantity || 0;
        this.created_at = bot.created_at || new Date().toISOString();
    }
}