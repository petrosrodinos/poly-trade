import { Request, Response } from 'express';
import { TradesService } from './trades.service';

export class TradesController {
    tradesService: TradesService;

    constructor() {
        this.tradesService = new TradesService();

    }

    streamStockPrice = async (req: Request, res: Response): Promise<void> => {
        const symbol = req.query.symbol as string;

        console.log('symbol', symbol);

        if (!symbol) {
            res.status(400).send('Symbol is required');
            return;
        }

        if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() !== 'websocket') {
            res.status(400).send('WebSocket connection required');
            return;
        }

        const ws = req.socket as any;
        await this.tradesService.subscribeToStock(symbol, ws);

        ws.on('close', () => {
            this.tradesService.removeClient(symbol, ws);
        });

        await this.tradesService.streamStockPrice(symbol);
    }
}