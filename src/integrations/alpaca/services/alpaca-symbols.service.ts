import { AlpacaClient } from "../alpaca.client";

export class AlpacaSymbols {
    alpacaClient: AlpacaClient;


    constructor() {
        this.alpacaClient = new AlpacaClient();

    }

    async getOptionableTickers() {
        try {
            const assets = await this.alpacaClient.getClient().getAssets({
                status: 'active',
                asset_class: 'us_equity'
            });

            const optionableTickers = assets
                .filter((asset: any) => asset.tradable && asset.optionable)
                .map((asset: any) => asset.symbol);

            return optionableTickers;
        } catch (error) {
            throw error;
        }
    }


    async checkOptionableTicker(symbol: string) {
        try {
            const asset = await this.alpacaClient.getClient().getAsset(symbol);
            if (asset.asset_class === 'us_equity' && asset.tradable && asset.optionable) {
                return { symbol, optionable: true, details: asset };
            } else {
                return { symbol, optionable: false, details: asset };
            }
        } catch (error) {
            throw error;
        }
    }

}