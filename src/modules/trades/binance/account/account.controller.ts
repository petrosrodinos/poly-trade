import { Request, Response } from "express";
import { BinanceAccountServiceClass } from "./account.service";

export class BinanceAccountController {
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
            const orders = await this.binanceAccountService.getFuturesUserTrades();
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
            const income = await this.binanceAccountService.getFuturesIncome();
            res.status(200).json(income);
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to get futures income',
                error: error.message
            });
        }
    }


}