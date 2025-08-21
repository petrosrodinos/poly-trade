import { Request, Response } from "express";
import { BinanceAccountServiceClass } from "./account.service";
import { Timeframe } from "./interfaces/account.interfaces";
import { AuthenticatedRequest } from "../../shared/middleware/auth.middleware";

export class AccountController {
    private binanceAccountService: BinanceAccountServiceClass;

    constructor() {
        this.binanceAccountService = new BinanceAccountServiceClass();
    }

    getAccount = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const account = await this.binanceAccountService.getAccount(req.user!.uuid);
            res.status(200).json(account);
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to get account status',
                error: error.message
            });
        }
    }

    getAccountIncomeChart = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const timeframe = req.query.timeframe as Timeframe;
            const incomeChart = await this.binanceAccountService.getAccountTradesChart(req.user!.uuid, timeframe);
            res.status(200).json(incomeChart);
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to get account income chart',
                error: error.message
            });
        }
    }

    getAccountFutures = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const account = await this.binanceAccountService.getAccountFutures(req.user!.uuid);
            res.status(200).json(account);
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to get account status',
                error: error.message
            });
        }
    }


    getFuturesUserTrades = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const symbol = req.query.symbol?.toString().toUpperCase() as string;
            const orders = await this.binanceAccountService.getFuturesUserTrades(req.user!.uuid, symbol);
            res.status(200).json(orders);
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to get futures orders',
                error: error.message
            });
        }
    }


    getFuturesIncome = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const symbol = req.query.symbol?.toString().toUpperCase() as string;
            const income = await this.binanceAccountService.getFuturesIncome(req.user!.uuid, symbol);
            res.status(200).json(income);
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to get futures income',
                error: error.message
            });
        }
    }

    ping = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const result = await this.binanceAccountService.ping(req.user!.uuid);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({
                message: 'Error',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

}