export interface BrokerFuturesPosition {
    symbol: string;
    positionAmt: string;
    entryPrice: string;
    markPrice: string;
    unRealizedProfit: string;
    positionSide: string;
}


export interface BrokerFuturesOrder {
    symbol: string;
    orderId: number;
    clientOrderId: string;
    transactTime: number;
    origQty: string;
    executedQty: string;
    status: string;
    timeInForce: string;
    type: string;
    side: string;
}


export type BrokerFuturesOrderSide = 'BUY' | 'SELL';
export type BrokerFuturesOrderType = 'MARKET' | 'LIMIT';
export type BrokerFuturesPositionSide = 'LONG' | 'SHORT' | 'BOTH';