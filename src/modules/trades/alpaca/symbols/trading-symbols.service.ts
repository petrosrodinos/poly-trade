import { AlpacaSymbols } from "../../../../integrations/alpaca/services/alpaca-symbols.service";

export class TradingSymbolsService {
    alpacaSymbols: AlpacaSymbols;

    constructor() {
        this.alpacaSymbols = new AlpacaSymbols();
    }

    async getOptionableTickers() {
        const optionableTickers = await this.alpacaSymbols.getOptionableTickers();
        return optionableTickers;
    }

    async checkOptionableTicker(symbol: string) {
        const optionableTicker = await this.alpacaSymbols.checkOptionableTicker(symbol);
        return optionableTicker;
    }
}