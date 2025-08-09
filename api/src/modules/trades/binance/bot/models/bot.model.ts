import { Bot } from "../dto/bot.dto";

export class BotModel {
    id: string;
    symbol: string;
    amount: number;
    interval: string;
    leverage: number;
    active: boolean;
    created_at: string;

    constructor(bot: Bot) {
        this.id = bot.id;
        this.symbol = bot.symbol;
        this.amount = bot.amount;
        this.interval = bot.interval || '1m';
        this.leverage = bot.leverage || 1;
        this.active = bot.active || true;
        this.created_at = bot.created_at || new Date().toISOString();
    }
}