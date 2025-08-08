import { Router } from 'express';
import { BinanceStreamingController } from './streaming/streaming.controller';
import { BinanceTradingBotController } from './bot/trading-bot.controller';
import { BinanceAccountController } from './bot/account.controller';

const router = Router();

const binanceStreamingController = new BinanceStreamingController();
const binanceTradingBotController = new BinanceTradingBotController();
const binanceAccountController = new BinanceAccountController();

router.get('/stream/:symbol', binanceStreamingController.streamTickerPrice);

router.get('/status', binanceStreamingController.getStreamStatus);
router.post('/terminate-all', binanceStreamingController.terminateAllStreams);

router.post('/bot/start/:symbol', binanceTradingBotController.startBot);
router.post('/bot/stop/:symbol', binanceTradingBotController.stopBot);
router.get('/bot/status/:symbol', binanceTradingBotController.getBotStatus);
router.get('/bot/position/:symbol', binanceTradingBotController.getPositionInfo);
router.get('/bot/positions', binanceTradingBotController.getAllPositions);
router.get('/bot/stream-status/:symbol', binanceTradingBotController.streamBotStatus);

router.get('/account/trades', binanceAccountController.getFuturesUserTrades);
router.get('/account/status', binanceAccountController.getAccountFutures);
router.post('/account/orders/cancel/:symbol', binanceAccountController.cancelOrder);
router.get('/account/income', binanceAccountController.getFuturesIncome);

export { router as binanceRouter };