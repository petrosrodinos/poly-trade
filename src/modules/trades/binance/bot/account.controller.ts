import { Request, Response } from "express";
import { BinanceAccountService } from "../../../../integrations/binance/services/binance-account.service";
import { BinanceTradesService } from "../../../../integrations/binance/services/binance-trades.service";

export class BinanceAccountController {
    private binanceAccountService: BinanceAccountService;
    private binanceTradesService: BinanceTradesService;

    constructor() {
        this.binanceAccountService = new BinanceAccountService();
        this.binanceTradesService = new BinanceTradesService();
    }


    getAccountFutures = async (req: Request, res: Response) => {
        try {
            const account = await this.binanceAccountService.getAccountFutures();
            res.status(200).json(account);
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to get account status',
                error: error.message
            });
        }
    }

    getAccountFuturesBalance = async (req: Request, res: Response) => {
        try {
            const account = await this.binanceAccountService.getAccountFuturesBalance();
            res.status(200).json(account);
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to get account status',
                error: error.message
            });
        }
    }


    getFuturesUserTrades = async (req: Request, res: Response) => {
        try {
            const orders = await this.binanceAccountService.getFuturesUserTrades();
            res.status(200).json(orders);
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to get futures orders',
                error: error.message
            });
        }
    }

    getOpenOrders = async (req: Request, res: Response) => {
        try {
            const symbol = req.params.symbol as string;
            const orders = await this.binanceTradesService.getOpenOrders(symbol);
            res.status(200).json(orders);
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to get open orders',
                error: error.message
            });
        }
    }

    cancelAllOrders = async (req: Request, res: Response) => {
        try {

            const symbol = req.params.symbol as string;

            const orders = await this.binanceTradesService.cancelAllOrders(symbol);
            res.status(200).json({
                message: 'All orders cancelled',
                orders: orders
            });
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to cancel all orders',
                error: error.message
            });
        }
    }

    getFuturesIncome = async (req: Request, res: Response) => {
        try {
            const income = await this.binanceTradesService.futuresIncome();
            res.status(200).json(income);
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to get futures income',
                error: error.message
            });
        }
    }


}