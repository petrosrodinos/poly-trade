import { Request, Response } from 'express';
import { WebSocket } from 'ws';
import { TradingBotService } from './trading-bot.service';

export class TradingBotController {
    tradingBotService: TradingBotService;

    constructor() {
        this.tradingBotService = new TradingBotService();
    }

    startBot = async (req: Request, res: Response): Promise<void> => {
        const symbol = req.params.symbol.toUpperCase();
        try {
            await this.tradingBotService.startBot(symbol);
            res.status(200).json({ message: `Trading bot started for ${symbol}` });
        } catch (error) {
            res.status(500).json({ message: `Failed to start bot for ${symbol}`, error });
        }
    }

    stopBot = async (req: Request, res: Response): Promise<void> => {
        const symbol = req.params.symbol.toUpperCase();
        try {
            await this.tradingBotService.stopBot(symbol);
            res.status(200).json({ message: `Trading bot stopped for ${symbol}` });
        } catch (error) {
            res.status(500).json({ message: `Failed to stop bot for ${symbol}`, error });
        }
    }

    streamBotStatus = async (req: Request, res: Response): Promise<void> => {
        const symbol = req.params.symbol.toUpperCase();

        if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() !== 'websocket') {
            res.status(400).send('WebSocket connection required');
            return;
        }

        const ws = req.socket as any;

        const sendStatus = () => {
            ws.send(JSON.stringify({
                symbol,
                isRunning: this.tradingBotService.isBotRunning(symbol),
                position: this.tradingBotService['positions'].get(symbol) || 'none',
                lastCandle: this.tradingBotService['candles'].get(symbol)?.slice(-1)[0] || null
            }));
        };

        // Send initial status
        sendStatus();

        // Update status every 5 seconds
        const interval = setInterval(sendStatus, 5000);

        ws.on('close', () => {
            clearInterval(interval);
        });
    }
}