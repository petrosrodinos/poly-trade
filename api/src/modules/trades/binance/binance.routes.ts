import { Router } from 'express';
import { BinanceStreamingController } from './streaming/streaming.controller';
// import { BinanceTradingBotController } from './bot/trading-bot.controller';

const router = Router();

const binanceStreamingController = new BinanceStreamingController();
// const binanceTradingBotController = new BinanceTradingBotController();

router.get('/stream/:symbol', binanceStreamingController.streamTickerPrice);
router.get('/status', binanceStreamingController.getStreamStatus);
router.post('/terminate-all', binanceStreamingController.terminateAllStreams);

// router.post('/bot', binanceTradingBotController.createBot);
// router.post('/bot/start/:id', binanceTradingBotController.startBot);
// router.post('/bot/stop/:id', binanceTradingBotController.stopBot);
// router.get('/bot/:id', binanceTradingBotController.getBot);
// router.get('/bots', binanceTradingBotController.getBots);
// router.put('/bot/:id', binanceTradingBotController.updateBot);
// router.delete('/bot/:id', binanceTradingBotController.deleteBot);
// router.post('/bots/start-all', binanceTradingBotController.startAllBots);
// router.post('/bots/stop-all', binanceTradingBotController.stopAllBots);
// router.post('/bot/orders/cancel/:symbol', binanceTradingBotController.cancelOrder);



export { router as binanceRouter };