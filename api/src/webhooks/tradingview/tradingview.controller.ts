import { Request, Response } from 'express';
import { TradingviewService } from './tradingview.service';
import { logger } from '../../shared/utils/logger';
import { TradingviewAlertWebhookSchema } from './dto/tradingview.dto';

export class TradingviewController {
    private tradingviewService: TradingviewService;

    constructor() {
        this.tradingviewService = new TradingviewService();
        this.handleAlertWebhook = this.handleAlertWebhook.bind(this);
    }

    async handleAlertWebhook(req: Request, res: Response) {
        try {
            const validatedData = TradingviewAlertWebhookSchema.parse(req.body);

            const result = await this.tradingviewService.handleAlertWebhook(validatedData);

            console.log('result', result);
            console.log('data', req.body);

            return res.status(200).json({
                message: 'Alert webhook received and processed',
                result: result
            });

        } catch (error) {
            if (error instanceof Error && error.name === 'ZodError') {
                return res.status(400).json({
                    message: 'Invalid request data',
                    errors: error.message
                });
            }

            logger.error('TradingView webhook processing failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
            });

            return res.status(500).json({
                message: 'Failed to handle alert webhook',
                timestamp: new Date().toISOString(),
                error: error
            });
        }
    }

}