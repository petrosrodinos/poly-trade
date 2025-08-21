import { Router } from 'express';
import { TradingviewController } from './tradingview.controller';
import { createTradingViewProtection } from '../../../shared/middleware/origin-protection.middleware';

const tradingviewController = new TradingviewController();
const tradingViewProtection = createTradingViewProtection();

const router = Router();

router.post('/tradingview', tradingviewController.handleAlertWebhook);

export { router as tradingviewRouter }; 