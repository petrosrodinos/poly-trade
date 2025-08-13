import { TradingviewAlertWebhook } from "./tradingview.interfaces";
import { logger } from "../../shared/utils/logger";

export class TradingviewService {

    constructor() { }

    async handleAlertWebhook(data: TradingviewAlertWebhook) {
        try {

            // difference in milliseconds
            const timeDifference = new Date(data.time).getTime() - new Date().getTime();
            console.log('timeDifference', timeDifference);

            return data
        } catch (error) {
            logger.error('TradingView webhook processing error', error);
            throw error;
        }
    }



}