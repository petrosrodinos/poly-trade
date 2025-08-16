export class WebhookCacheService {
    private static instance: WebhookCacheService;
    private cache: Map<string, number> = new Map();
    private readonly TTL_MS = 5 * 60 * 1000; // 5 minutes TTL

    private constructor() {
        this.startCleanupInterval();
    }

    public static getInstance(): WebhookCacheService {
        if (!WebhookCacheService.instance) {
            WebhookCacheService.instance = new WebhookCacheService();
        }
        return WebhookCacheService.instance;
    }

    public isProcessed(uuid: string, time: string): boolean {
        const key = this.generateKey(uuid, time);
        const timestamp = this.cache.get(key);

        if (!timestamp) {
            return false;
        }

        const isExpired = Date.now() - timestamp > this.TTL_MS;
        if (isExpired) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    public markAsProcessed(uuid: string, time: string): void {
        const key = this.generateKey(uuid, time);
        this.cache.set(key, Date.now());
    }

    private generateKey(uuid: string, time: string): string {
        return `${uuid}-${time}`;
    }

    private startCleanupInterval(): void {
        setInterval(() => {
            const now = Date.now();
            for (const [key, timestamp] of this.cache.entries()) {
                if (now - timestamp > this.TTL_MS) {
                    this.cache.delete(key);
                }
            }
        }, this.TTL_MS);
    }

    public clearCache(): void {
        this.cache.clear();
    }

    public getCacheSize(): number {
        return this.cache.size;
    }
}
