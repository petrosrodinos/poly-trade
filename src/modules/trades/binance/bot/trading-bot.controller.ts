import { Request, Response } from 'express';
import { BinanceTradesService } from "../../../../integrations/binance/services/binance-trades.service";
import { BinanceTradingBotService } from './trading-bot.service';
import { logger } from '../../../../shared/utils/logger';

export class BinanceTradingBotController {
    private binanceTradesService: BinanceTradesService;
    private tradingBotService: BinanceTradingBotService;

    constructor() {
        this.binanceTradesService = new BinanceTradesService();
        this.tradingBotService = new BinanceTradingBotService();
    }

    startBot = async (req: Request, res: Response): Promise<void> => {
        const symbol = (req.params.symbol as string)?.toUpperCase();

        if (!symbol) {
            res.status(400).json({ message: 'Symbol parameter is required' });
            return;
        }

        try {
            await this.tradingBotService.startBot(symbol);
            res.status(200).json({ message: `Binance trading bot started for ${symbol}` });
        } catch (error: any) {
            console.error(`Failed to start bot for ${symbol}:`, error);

            if (error.message?.includes('Insufficient balance')) {
                res.status(400).json({
                    message: `Insufficient balance to start trading bot`,
                    error: error.message
                });
            } else if (error.message?.includes('Account')) {
                res.status(503).json({
                    message: `Binance account service unavailable`,
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
        const symbol = (req.params.symbol as string)?.toUpperCase();

        if (!symbol) {
            res.status(400).json({ message: 'Symbol parameter is required' });
            return;
        }

        try {
            await this.tradingBotService.stopBot(symbol);
            res.status(200).json({ message: `Binance trading bot stopped for ${symbol}` });
        } catch (error: any) {
            console.error(`Failed to stop bot for ${symbol}:`, error);

            if (error.message?.includes('Trading')) {
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



    getPositionInfo = async (req: Request, res: Response): Promise<void> => {
        const symbol = (req.params.symbol as string)?.toUpperCase();

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
                positionAmt: position.positionAmt,
                entryPrice: position.entryPrice,
                markPrice: position.markPrice,
                unrealized_pl: position.unRealizedProfit,
                positionSide: position.positionSide
            });
        } catch (error: any) {
            console.error(`Failed to get position info for ${symbol}:`, error);
            res.status(500).json({
                message: `Failed to retrieve position info for ${symbol}`,
                error: error.message || 'Unknown error occurred'
            });
        }
    }

    getBotStatus = async (req: Request, res: Response): Promise<void> => {
        const symbol = (req.params.symbol as string)?.toUpperCase();

        if (!symbol) {
            res.status(400).json({ message: 'Symbol parameter is required' });
            return;
        }

        try {
            const status = this.tradingBotService.getBotStatus(symbol);
            res.status(200).json(status);
        } catch (error: any) {
            console.error(`Failed to get bot status for ${symbol}:`, error);
            res.status(500).json({
                message: `Failed to retrieve bot status for ${symbol}`,
                error: error.message || 'Unknown error occurred'
            });
        }
    }

    getAllPositions = async (req: Request, res: Response): Promise<void> => {
        try {
            const positions = await this.tradingBotService.getAllPositions();
            res.status(200).json({ positions });
        } catch (error: any) {
            console.error('Failed to get all positions:', error);
            res.status(500).json({
                message: 'Failed to retrieve all positions',
                error: error.message || 'Unknown error occurred'
            });
        }
    }

    streamBotStatus = async (req: Request, res: Response): Promise<void> => {
        const symbol = (req.params.symbol as string)?.toUpperCase();

        if (!symbol) {
            res.status(400).json({ message: 'Symbol parameter is required' });
            return;
        }

        if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() !== 'websocket') {
            res.status(400).send('WebSocket connection required');
            return;
        }

        const ws = req.socket as any;

        const sendStatus = () => {
            const status = this.tradingBotService.getBotStatus(symbol);
            ws.send(JSON.stringify(status));
        };

        sendStatus();

        const interval = setInterval(sendStatus, 5000);

        ws.on('close', () => {
            clearInterval(interval);
        });
    }


    cancelOrder = async (req: Request, res: Response) => {
        try {

            const symbol = req.params.symbol as string;

            const orders = await this.binanceTradesService.closePosition(symbol);
            logger.success(`Cancelled order for ${symbol}`);
            res.status(200).json({
                message: 'Order cancelled',
                orders: orders
            });
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to cancel order',
                error: error.message
            });
        }
    }
}