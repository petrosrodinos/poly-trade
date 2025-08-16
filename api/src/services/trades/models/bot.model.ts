export class BotModel {
    uuid: string;
    symbol: string;
    strategy?: string;
    timeframe: string;
    active: boolean;
    createdAt?: string;
    subscriptions: Map<string, BotSubscriptionModel>;

    constructor(bot: BotModel) {
        this.uuid = bot.uuid;
        this.symbol = bot.symbol;
        this.strategy = bot.strategy;
        this.timeframe = bot.timeframe;
        this.active = bot.active;
        this.createdAt = bot.createdAt || new Date().toISOString();
        this.subscriptions = bot.subscriptions || new Map();
    }
}

export class BotSubscriptionModel {
    uuid: string;
    user_uuid: string;
    amount: number;
    quantity: number;
    leverage: number;
    active: boolean;
    createdAt?: string;

    constructor(bot: BotSubscriptionModel) {
        this.uuid = bot.uuid;
        this.user_uuid = bot.user_uuid;
        this.amount = bot.amount;
        this.leverage = bot.leverage || 1;
        this.active = bot.active;
        this.quantity = bot.quantity || 0;
        this.createdAt = bot.createdAt || new Date().toISOString();
    }
}