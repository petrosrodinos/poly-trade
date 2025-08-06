import { Request, Response } from 'express';
import { AlpacaSymbols } from "../../../../integrations/alpaca/services/alpaca-symbols.service";

export class TradingSymbolsService {
    alpacaSymbols: AlpacaSymbols;

    constructor() {
        this.alpacaSymbols = new AlpacaSymbols();
    }

    getOptionableTickers = async (req: Request, res: Response) => {
        try {
            const optionableTickers = await this.alpacaSymbols.getOptionableTickers();
            res.json(optionableTickers);
        } catch (error) {
            console.error('Error fetching optionable tickers:', error);
            res.status(500).json({ error: 'Failed to fetch optionable tickers' });
        }
    }

    checkOptionableTicker = async (req: Request, res: Response) => {
        try {
            const { symbol } = req.params;
            const optionableTicker = await this.alpacaSymbols.checkOptionableTicker(symbol);
            res.json(optionableTicker);
        } catch (error) {
            console.error('Error checking optionable ticker:', error);
            res.status(500).json({ error: 'Failed to check optionable ticker' });
        }
    }
}