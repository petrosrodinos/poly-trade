export class BotUtils {

    constructor() { }

    getTimeframeInMiliseconds(timeframe: string) {

        switch (timeframe) {
            case '1m':
                return 60000;
            case '3m':
                return 180000;
            case '5m':
                return 300000;
            case '15m':
                return 900000;
            case '30m':
                return 1800000;
            case '1h':
                return 3600000;
            case '2h':
                return 7200000;
            case '4h':
                return 14400000;
            default:
                return 60000;

        }
    }
}
