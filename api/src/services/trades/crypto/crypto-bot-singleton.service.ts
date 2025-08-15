import { CryptoBotService } from "./crypto-bot.service";

class CryptoBotSingleton {
    private static instance: CryptoBotService;

    public static getInstance(): CryptoBotService {
        if (!CryptoBotSingleton.instance) {
            CryptoBotSingleton.instance = new CryptoBotService();
        }
        return CryptoBotSingleton.instance;
    }
}

export default CryptoBotSingleton;
