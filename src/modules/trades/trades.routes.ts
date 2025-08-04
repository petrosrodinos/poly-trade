import { Router } from 'express';
import { TradesController } from './trades.controller';
import { TradingBotController } from './trading-bot.controller';

const router = Router();

const tradesController = new TradesController();
const tradingBotController = new TradingBotController();

router.get('/stream', tradesController.streamStockPrice);

router.post('/bot/start', tradingBotController.startBot);
router.post('/bot/stop', tradingBotController.stopBot);
router.get('/bot/status', tradingBotController.streamBotStatus);
router.get('/account/status', tradingBotController.getAccountStatus);
router.get('/position', tradingBotController.getPositionInfo);

export { router as tradesRouter };