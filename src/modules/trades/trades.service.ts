import { AlpacaStreamingService } from '../../integrations/alpaca/alpaca.streaming';
import { WebSocket } from 'ws';

export class TradesService {
    private activeStreams: Set<string> = new Set();

    constructor(private alpacaStreamingService: AlpacaStreamingService) { }

    async streamStockPrice(symbol: string): Promise<void> {
        if (!this.activeStreams.has(symbol)) {
            this.activeStreams.add(symbol);
            await this.alpacaStreamingService.streamQuotes(symbol);
        }
    }

    async subscribeToStock(symbol: string, ws: WebSocket): Promise<void> {
        await this.alpacaStreamingService.subscribeToStock(symbol, ws);
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