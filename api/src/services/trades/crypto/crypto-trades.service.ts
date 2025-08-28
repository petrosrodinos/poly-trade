import { TradingviewAlertWebhookDto } from "../../../modules/webhooks/tradingview/dto/tradingview.dto";
import CryptoBotSingleton from "../models/crypto-bot-singleton.service";
import { CryptoBotService } from "./crypto-bot.service";
import { BotModel } from "../models/bot.model";
import { BrokersFuturesTradesService } from "../../../integrations/brokers/futures/services/brokers-trades.services";
import { Exchanges } from "../../../integrations/brokers/futures/interfaces/brokers-account.interfaces";

export class CryptoTradesService {
    private cryptoBotService: CryptoBotService;
    private brokersFuturesTradesService: BrokersFuturesTradesService;

    constructor() {
        this.cryptoBotService = CryptoBotSingleton.getInstance();
        this.brokersFuturesTradesService = new BrokersFuturesTradesService();
    }

    async handleAlertWebhook(data: TradingviewAlertWebhookDto) {

        try {
            const { uuid, symbol, action } = data;

            const bot: BotModel | null = await this.cryptoBotService.getBotByUuid(uuid);

            if (!bot || !bot.active || bot.symbol.toLowerCase() !== symbol.toLowerCase()) {
                console.log('bot not found', uuid);
                return;
            }

            const subscriptions = Array.from(bot.subscriptions.values());

            await Promise.allSettled(
                subscriptions
                    .filter(s => s.active)
                    .map(async s => {
                        try {
                            await this.brokersFuturesTradesService.closePosition(s.user_uuid, Exchanges.DEFAULT, bot.symbol);
                            await this.brokersFuturesTradesService.openPosition(
                                s.user_uuid,
                                Exchanges.DEFAULT,
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