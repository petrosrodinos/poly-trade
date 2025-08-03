import { AlpacaStreamingService } from '../../integrations/alpaca/alpaca.streaming';
import { getAlpacaConfig } from '../../integrations/alpaca/alpaca.config';
import { WebSocket } from 'ws';

export class TradesService {
    private activeStreams: Set<string> = new Set();
    alpacaStreamingService: AlpacaStreamingService;

    constructor() {
        this.alpacaStreamingService = new AlpacaStreamingService(getAlpacaConfig());
    }

    async subscribeToStock(symbol: string, ws: WebSocket): Promise<void> {
        await this.alpacaStreamingService.subscribeToStock(symbol, ws);
    }

    async streamStockPrice(symbol: string): Promise<void> {
        if (!this.activeStreams.has(symbol)) {
            this.activeStreams.add(symbol);
            await this.alpacaStreamingService.streamQuotes(symbol);
        }
    }

    removeClient(symbol: string, ws: WebSocket): void {
        this.alpacaStreamingService.removeClient(symbol, ws);
        // Optionally clean up activeStreams if no clients remain
        const clients = this.alpacaStreamingService['wsClients'].get(symbol) || [];
        if (clients.length === 0) {
            this.activeStreams.delete(symbol);
        }
    }

    isStreaming(symbol: string): boolean {
        return this.activeStreams.has(symbol);
    }
}