import { Router } from 'express';
import { TradesController } from './trades.controller';
import { TradingBotController } from './trading-bot.controller';

const router = Router();

const tradesController = new TradesController();
const tradingBotController = new TradingBotController();

router.get('/stream', tradesController.streamStockPrice);

router.post('/bot/start/:symbol', tradingBotController.startBot);
router.post('/bot/stop/:symbol', tradingBotController.stopBot);
router.get('/bot/status/:symbol', tradingBotController.streamBotStatus);

export { router as tradesRouter };