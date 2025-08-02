import { Router } from 'express';
import { TradesController } from './trades.controller';
import { TradesService } from './trades.service';
import { AlpacaStreamingService } from '../../integrations/alpaca/alpaca.streaming';
import { getAlpacaConfig } from '../../integrations/alpaca/alpaca.config';

const router = Router();
const alpacaStreamingService = new AlpacaStreamingService(getAlpacaConfig());
const tradesService = new TradesService(alpacaStreamingService);
const tradesController = new TradesController(tradesService);

router.get('/stream/:symbol', tradesController.streamStockPrice);

export { router as tradesRouter };