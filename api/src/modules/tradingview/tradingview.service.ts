import { CryptoTradesService } from "../../services/trades/crypto/crypto-trades.service";
import { logger } from "../../shared/utils/logger";
import { WebhookCacheService } from "../../shared/services/webhook-cache.service";
import { TradingviewAlertWebhookDto } from "./dto/tradingview.dto";

export class TradingviewService {
    private cryptoTradesService: CryptoTradesService;
    private webhookCache: WebhookCacheService;

    constructor() {
        this.cryptoTradesService = new CryptoTradesService();
        this.webhookCache = WebhookCacheService.getInstance();
    }

    async handleAlertWebhook(data: TradingviewAlertWebhookDto) {
        try {
            const { uuid, time } = data;

            if (this.webhookCache.isProcessed(uuid, time)) {
                return {
                    message: 'Webhook already processed',
                    uuid,
                    time,
                    duplicate: true
                };
            }

            this.webhookCache.markAsProcessed(uuid, time);

            await this.cryptoTradesService.handleAlertWebhook(data);

            return {
                ...data,
                duplicate: false,
                processed: true
            };

        } catch (error) {
            logger.error('TradingView webhook processing error', error);
            throw error;
        }
    }



}