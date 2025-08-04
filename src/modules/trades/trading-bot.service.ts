import { AlpacaStreamingService } from '../../integrations/alpaca/alpaca.streaming';
import { AlpacaStreamingType, AlpacaPosition, AlpacaAccount } from '../../integrations/alpaca/alpaca.interface';
import { AlpacaService } from '../../integrations/alpaca/alpaca.service';

interface Candle {
    open: number;
    close: number;
    high: number;
    low: number;
    timestamp: number;
}

export class TradingBotService {
    alpacaStreamingService: AlpacaStreamingService;
    alpacaService: AlpacaService;

    private activeStreams: Set<string> = new Set();
    private candles: Map<string, Candle[]> = new Map();
    private positions: Map<string, 'call' | 'put' | null> = new Map();
    private currentMinute: Map<string, number> = new Map();

    constructor(
    ) {
        this.alpacaStreamingService = new AlpacaStreamingService();
        this.alpacaService = new AlpacaService();
    }

    async startBot(symbol: string, type: AlpacaStreamingType): Promise<void> {
        try {
            if (this.activeStreams.has(symbol)) {
                return;
            }

            this.activeStreams.add(symbol);
            this.candles.set(symbol, []);
            this.positions.set(symbol, null);

            const ws = await this.alpacaStreamingService.connectWebSocket(type);

            ws.on('message', (data: string) => {
                const messages = JSON.parse(data);
                messages.forEach((message: any) => {
                    if (message.T === 'q' && message.S === symbol) {
                        this.processQuote(symbol, message);
                    }
                });
            });

            ws.on('error', (error) => {
                console.error(`WebSocket error for ${symbol}:`, error);
            });

            await this.alpacaStreamingService.subscribeToStock(symbol, ws);
        } catch (error) {
            console.error(`Error starting bot for ${symbol}:`, error);
        }
    }

    private async processQuote(symbol: string, quote: any): Promise<void> {
        try {
            const timestamp = new Date(quote.t).getTime();
            const minute = Math.floor(timestamp / 60000); // 1-minute timeframe
            const price = (quote.bp + quote.ap) / 2; // Midpoint of bid/ask

            if (this.currentMinute.get(symbol) !== minute) {
                // New minute, finalize previous candle
                const candles = this.candles.get(symbol) || [];
                if (candles.length > 0) {
                    const lastCandle = candles[candles.length - 1];
                    await this.processCandle(symbol, lastCandle);
                }

                // Start new candle
                this.candles.set(symbol, [
                    ...candles,
                    { open: price, close: price, high: price, low: price, timestamp }
                ]);
                this.currentMinute.set(symbol, minute);
            } else {
                // Update current candle
                const candles = this.candles.get(symbol) || [];
                const currentCandle = candles[candles.length - 1];
                if (currentCandle) {
                    currentCandle.close = price;
                    currentCandle.high = Math.max(currentCandle.high, price);
                    currentCandle.low = Math.min(currentCandle.low, price);
                    this.candles.set(symbol, [...candles.slice(0, -1), currentCandle]);
                }
            }
        } catch (error) {
            console.error(`Error processing quote for ${symbol}:`, error);
        }
    }

    private async processCandle(symbol: string, candle: Candle): Promise<void> {
        try {
            const isGreen = candle.close > candle.open;
            const currentPosition = this.positions.get(symbol);

            if (isGreen && currentPosition !== 'call') {
                // Green candle: open call (buy) position
                if (currentPosition === 'put') {
                    await this.alpacaService.closePosition(symbol);
                }
                await this.alpacaService.openPosition(symbol, 'buy');
                this.positions.set(symbol, 'call');
            } else if (!isGreen && currentPosition !== 'put') {
                // Red candle: open put (sell) position
                if (currentPosition === 'call') {
                    await this.alpacaService.closePosition(symbol);
                }
                await this.alpacaService.openPosition(symbol, 'sell');
                this.positions.set(symbol, 'put');
            }
        } catch (error) {
            console.error(`Error processing candle for ${symbol}:`, error);
        }
    }



    async stopBot(symbol: string): Promise<void> {
        try {
            if (this.activeStreams.has(symbol)) {
                this.activeStreams.delete(symbol);
                this.candles.delete(symbol);
                this.positions.delete(symbol);
                this.currentMinute.delete(symbol);
                await this.alpacaService.closePosition(symbol);
                console.log(`Stopped bot for ${symbol}`);
            }
        } catch (error) {
            console.error(`Error stopping bot for ${symbol}:`, error);
        }
    }

    isBotRunning(symbol: string): boolean {
        return this.activeStreams.has(symbol);
    }

    async getAccountStatus(): Promise<AlpacaAccount> {
        return this.alpacaService.getAccount();
    }

    async getPositionInfo(symbol: string): Promise<AlpacaPosition | null> {
        return this.alpacaService.getPosition(symbol);
    }
}