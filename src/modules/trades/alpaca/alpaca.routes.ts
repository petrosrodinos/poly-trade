import { Router } from 'express';
import { AlpacaStreamingController } from './streaming/streaming.controller';
import { TradingBotController } from './bot/trading-bot.controller';
import { TradingSymbolsService } from './symbols/trading-symbols.service';

const router = Router();

const tradesController = new AlpacaStreamingController();
const tradingBotController = new TradingBotController();
const tradingSymbolsService = new TradingSymbolsService();

router.get('/stream', tradesController.streamStockPrice);

router.post('/bot/start', tradingBotController.startBot);
router.post('/bot/stop', tradingBotController.stopBot);
router.get('/bot/status', tradingBotController.streamBotStatus);
router.get('/bot/account/status', tradingBotController.getAccountStatus);
router.get('/bot/position', tradingBotController.getPositionInfo);

router.get('/symbols/optionable', tradingSymbolsService.getOptionableTickers);
router.get('/symbols/optionable/:symbol', tradingSymbolsService.checkOptionableTicker);


export { router as alpacaRouter };