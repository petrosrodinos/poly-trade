import { Exchange } from 'ccxt';
import { ExchangeType } from '../futures/interfaces/brokers-account.interfaces';


export interface BrokerClient extends Exchange {
    type: ExchangeType;
    user_uuid: string;
}