import { Request, Response } from 'express';
import { WebSocket } from 'ws';
import { TradingBotService } from './trading-bot.service';
import { AlpacaStreamingType } from '@/integrations/alpaca/alpaca.interface';

export class TradingBotController {
    tradingBotService: TradingBotService;

    constructor() {
        this.tradingBotService = new TradingBotService();
    }

    startBot = async (req: Request, res: Response): Promise<void> => {
        const symbol = (req.query.symbol as string).toUpperCase();
        const type = (req.query.type as string) as AlpacaStreamingType;

        try {
            await this.tradingBotService.startBot(symbol, type);
            res.status(200).json({ message: `Trading bot started for ${symbol}` });
        } catch (error: any) {
            console.error(`Failed to start bot for ${symbol}:`, error);

            if (error.name === 'AccountException') {
                res.status(503).json({
                    message: `Account service unavailable`,
                    error: error.message
                });
            } else if (error.name === 'InsufficientBalanceException') {
                res.status(400).json({
                    message: `Insufficient balance to start trading bot`,
                    error: error.message
                });
            } else {
                res.status(500).json({
                    message: `Failed to start bot for ${symbol}`,
                    error: error.message || 'Unknown error occurred'
                });
            }
        }
    }

    stopBot = async (req: Request, res: Response): Promise<void> => {
        const symbol = (req.query.symbol as string).toUpperCase();

        if (!symbol) {
            res.status(400).json({ message: 'Symbol parameter is required' });
            return;
        }

        try {
            await this.tradingBotService.stopBot(symbol);
            res.status(200).json({ message: `Trading bot stopped for ${symbol}` });
        } catch (error: any) {
            console.error(`Failed to stop bot for ${symbol}:`, error);

            if (error.name === 'TradingException') {
                res.status(400).json({
                    message: `Error during bot shutdown`,
                    error: error.message
                });
            } else {
                res.status(500).json({
                    message: `Failed to stop bot for ${symbol}`,
                    error: error.message || 'Unknown error occurred'
                });
            }
        }
    }

    getAccountStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const account = await this.tradingBotService.getAccountStatus();
            res.status(200).json({
                account_id: account.id,
                status: account.status,
                buying_power: account.buying_power,
                cash: account.cash,
                portfolio_value: account.portfolio_value
            });
        } catch (error: any) {
            console.error('Failed to get account status:', error);

            if (error.name === 'AccountException') {
                res.status(503).json({
                    message: 'Account service unavailable',
                    error: error.message
                });
            } else {
                res.status(500).json({
                    message: 'Failed to retrieve account status',
                    error: error.message || 'Unknown error occurred'
                });
            }
        }
    }

    getPositionInfo = async (req: Request, res: Response): Promise<void> => {
        const symbol = (req.query.symbol as string).toUpperCase();

        if (!symbol) {
            res.status(400).json({ message: 'Symbol parameter is required' });
            return;
        }

        try {
            const position = await this.tradingBotService.getPositionInfo(symbol);

            if (!position) {
                res.status(404).json({ message: `No position found for ${symbol}` });
                return;
            }

            res.status(200).json({
                symbol: position.symbol,
                quantity: position.qty,
                side: position.side,
                market_value: position.market_value,
                unrealized_pl: position.unrealized_pl
            });
        } catch (error: any) {
            console.error(`Failed to get position info for ${symbol}:`, error);
            res.status(500).json({
                message: `Failed to retrieve position info for ${symbol}`,
                error: error.message || 'Unknown error occurred'
            });
        }
    }

    streamBotStatus = async (req: Request, res: Response): Promise<void> => {
        const symbol = (req.query.symbol as string).toUpperCase();

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