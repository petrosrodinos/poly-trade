import { Request, Response } from "express";
import { BinanceAccountServiceClass } from "./account.service";
import { Timeframe } from "./interfaces/account.interfaces";

export class AccountController {
    private binanceAccountService: BinanceAccountServiceClass;

    constructor() {
        this.binanceAccountService = new BinanceAccountServiceClass();
    }

    getAccount = async (req: Request, res: Response) => {
        try {
            const account = await this.binanceAccountService.getAccount();
            res.status(200).json(account);
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to get account status',
                error: error.message
            });
        }
    }

    getAccountIncomeChart = async (req: Request, res: Response) => {
        try {
            const timeframe = req.query.timeframe as Timeframe;
            const incomeChart = await this.binanceAccountService.getAccountTradesChart(timeframe);
            res.status(200).json(incomeChart);
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to get account income chart',
                error: error.message
            });
        }
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


    getFuturesUserTrades = async (req: Request, res: Response) => {
        try {
            const symbol = req.query.symbol?.toString().toUpperCase() as string;
            const orders = await this.binanceAccountService.getFuturesUserTrades(symbol);
            res.status(200).json(orders);
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to get futures orders',
                error: error.message
            });
        }
    }


    getFuturesIncome = async (req: Request, res: Response) => {
        try {
            const symbol = req.query.symbol?.toString().toUpperCase() as string;
            const income = await this.binanceAccountService.getFuturesIncome(symbol);
            res.status(200).json(income);
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to get futures income',
                error: error.message
            });
        }
    }


}