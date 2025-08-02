import { Request, Response } from 'express';
import { TradesService } from './trades.service';

export class TradesController {
    constructor(private tradesService: TradesService) { }

    streamStockPrice = async (req: Request, res: Response): Promise<void> => {
        const symbol = req.params.symbol.toUpperCase();

        if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() !== 'websocket') {
            res.status(400).send('WebSocket connection required');
            return;
        }

        const ws = req.socket as any;
        await this.tradesService.subscribeToStock(symbol, ws);

        ws.on('close', () => {
            this.tradesService.removeClient(symbol, ws);
        });

        if (!this.tradesService.isStreaming(symbol)) {
            await this.tradesService.streamStockPrice(symbol);
        }
    }
}