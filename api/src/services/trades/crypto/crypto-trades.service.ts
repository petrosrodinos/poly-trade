import { BinanceTradesService } from "../../../integrations/binance/services/binance-trades.service";
import { TradingviewAlertWebhookDto } from "../../../modules/tradingview/dto/tradingview.dto";
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

            // console.log('bot', bot);
            if (!bot || !bot.active || bot.symbol.toLowerCase() !== symbol.toLowerCase()) {
                return;
            }

            const subscriptions = Array.from(bot.subscriptions.values());

            await Promise.allSettled(
                subscriptions
                    .filter(s => s.active)
                    .map(async s => {
                        try {
                            await this.binanceTradesService.closePosition(bot.symbol);
                            await this.binanceTradesService.openPosition(
                                symbol,
                                action,
                                s.quantity,
                                s.leverage
                            );
                        } catch (err: any) {
                            console.error(`Subscription failed`, err.message);
                        }
                    })
            );

        } catch (error) {
            console.error('Error handling alert webhook', error);
            throw error;
        }

    }

}