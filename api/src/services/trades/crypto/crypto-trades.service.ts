import { BinanceTradesService } from "../../../integrations/binance/services/binance-trades.service";
import { TradingviewAlertWebhookDto } from "../../../webhooks/tradingview/dto/tradingview.dto";
import CryptoBotSingleton from "../models/crypto-bot-singleton.service";
import { CryptoBotService } from "./crypto-bot.service";
import { BotModel } from "../models/bot.model";

export class CryptoTradesService {
    private binanceTradesService: BinanceTradesService;
    private cryptoBotService: CryptoBotService;

    constructor() {
        this.cryptoBotService = CryptoBotSingleton.getInstance();
        this.binanceTradesService = new BinanceTradesService();
    }

    async handleAlertWebhook(data: TradingviewAlertWebhookDto) {

        try {
            const { uuid, symbol, action } = data;

            const bot: BotModel | null = await this.cryptoBotService.getBotByUuid(uuid);

            console.log('bot', bot);
            if (!bot || !bot.active || bot.symbol.toLowerCase() !== symbol.toLowerCase()) {
                console.log('bot is not active');
                return;
            }

            console.log('bot is active');

            const subscriptions = Array.from(bot.subscriptions.values());

            await Promise.all(
                subscriptions
                    // .filter(subscription => subscription.active)
                    .map(async subscription => {
                        if (!subscription.active) {
                            console.log('subscription is not active', subscription);
                        } else {
                            console.log('opening position', symbol, action, subscription.quantity, subscription.leverage);
                            // await this.binanceTradesService.closePosition(bot.symbol);
                            // this.binanceTradesService.openPosition(
                            //     symbol,
                            //     action,
                            //     subscription.quantity,
                            //     subscription.leverage
                            // )
                        }

                    }
                    )
            );
        } catch (error) {
            console.error('Error handling alert webhook', error);
            throw error;
        }

    }

}