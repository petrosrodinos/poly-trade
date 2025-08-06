import { WebSocket } from 'ws';
import { AlpacaConfig, getAlpacaConfig } from '../alpaca.config';
import { AlpacaStreamingType } from '../alpaca.interfaces';


export class AlpacaStreamingService {
    private config: AlpacaConfig;
    private wsClients: Map<string, WebSocket[]> = new Map();

    private wsTestUrl: string = 'wss://stream.data.alpaca.markets/v2/test';
    private wsStocksUrl: string = 'wss://stream.data.alpaca.markets/v2/iex  ';
    private wsCryptoUrl: string = 'wss://stream.data.alpaca.markets/v1beta3/crypto/us';

    private wsUrls: Map<string, string> = new Map([
        ['test', this.wsTestUrl],
        ['stocks', this.wsStocksUrl],
        ['crypto', this.wsCryptoUrl]
    ]);

    constructor() {
        this.config = getAlpacaConfig();

    }

    async connectWebSocket(type: AlpacaStreamingType = 'stocks'): Promise<WebSocket> {
        const wsUrl = this.wsUrls.get(type) || '';
        const ws = new WebSocket(wsUrl);

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
            // console.log(message);
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

    async streamQuotes(symbol: string): Promise<void> {

        let type: AlpacaStreamingType = 'stocks';

        if (symbol.includes("/")) {
            type = 'crypto'
        } else {
            type = 'stocks'
        }

        const ws = await this.connectWebSocket(type);

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

    removeClient(symbol: string, ws: WebSocket): void {
        const clients = this.wsClients.get(symbol) || [];
        const filteredClients = clients.filter(client => client !== ws);
        this.wsClients.set(symbol, filteredClients);
    }
}