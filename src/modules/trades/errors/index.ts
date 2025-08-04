export class InsufficientBalanceException extends Error {
    constructor(symbol: string, requested: number, available: number) {
        super(`Insufficient balance for ${symbol} (requested: ${requested}, available: ${available})`);
        this.name = 'InsufficientBalanceException';
    }
}

export class TradingException extends Error {
    constructor(message: string, public symbol?: string, public side?: string) {
        super(message);
        this.name = 'TradingException';
    }
}

export class AccountException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AccountException';
    }
}