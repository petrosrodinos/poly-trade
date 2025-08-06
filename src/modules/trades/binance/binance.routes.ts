import { Router } from 'express';
import { BinanceStreamingController } from './streaming/streaming.controller';
import { BinanceTradingBotController } from './bot/trading-bot.controller';

const router = Router();

const binanceStreamingController = new BinanceStreamingController();
const binanceTradingBotController = new BinanceTradingBotController();

router.get('/stream/:symbol', binanceStreamingController.streamTickerPrice);

router.get('/status', binanceStreamingController.getStreamStatus);
router.post('/terminate-all', binanceStreamingController.terminateAllStreams);

router.post('/bot/start/:symbol', binanceTradingBotController.startBot);
router.post('/bot/stop/:symbol', binanceTradingBotController.stopBot);
router.get('/bot/status/:symbol', binanceTradingBotController.getBotStatus);
router.get('/bot/account/status', binanceTradingBotController.getAccountStatus);
router.get('/bot/position/:symbol', binanceTradingBotController.getPositionInfo);
router.get('/bot/positions', binanceTradingBotController.getAllPositions);
router.get('/bot/stream-status/:symbol', binanceTradingBotController.streamBotStatus);

export { router as binanceRouter };