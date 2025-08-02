import { WebSocket } from 'ws';
import { AlpacaConfig } from './alpaca.config';


export class AlpacaStreamingService {
    private wsClients: Map<string, WebSocket[]> = new Map();
    private wsUrl: string = 'wss://stream.data.alpaca.markets/v2/test';

    constructor(private config: AlpacaConfig) { }

    async connectWebSocket(): Promise<WebSocket> {
        const ws = new WebSocket(this.wsUrl);

        ws.on('open', () => {
            ws.send(JSON.stringify({
                action: 'auth',
                key: this.config.keyId,
                secret: this.config.secretKey
            }));
        });

        return ws;
    }

    async subscribeToStock(symbol: string, ws: WebSocket): Promise<void> {
        ws.on('message', (data: string) => {
            const message = JSON.parse(data);
            console.log(message);
            if (message[0]?.T === 'success' && message[0]?.msg === 'authenticated') {
                ws.send(JSON.stringify({
                    action: 'subscribe',
                    quotes: [symbol]
                }));
            }
        });

        const clients = this.wsClients.get(symbol) || [];
        clients.push(ws);
        this.wsClients.set(symbol, clients);
    }

    broadcastQuote(symbol: string, quote: any): void {
        const clients = this.wsClients.get(symbol) || [];
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    symbol,
                    bidPrice: quote.bp,
                    askPrice: quote.ap,
                    timestamp: quote.t
                }));
            }
        });
    }

    async streamQuotes(symbol: string): Promise<void> {
        const ws = await this.connectWebSocket();

        ws.on('message', (data: string) => {
            const messages = JSON.parse(data);
            messages.forEach((message: any) => {
                if (message.T === 'q') {
                    this.broadcastQuote(symbol, message);
                }
            });
        });

        ws.on('error', (error) => {
            console.error(`WebSocket error for ${symbol}:`, error);
        });

        await this.subscribeToStock(symbol, ws);
    }

    removeClient(symbol: string, ws: WebSocket): void {
        const clients = this.wsClients.get(symbol) || [];
        const filteredClients = clients.filter(client => client !== ws);
        this.wsClients.set(symbol, filteredClients);
    }
}