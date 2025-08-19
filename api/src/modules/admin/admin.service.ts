import prisma from '../../core/prisma/prisma-client';
import { AdminStats } from './admin.interfaces';

export class AdminService {
    private prisma: any;

    constructor() {
        this.prisma = prisma;

    }

    async getAdminStats(): Promise<AdminStats> {
        const [totalUsers, verifiedUsers, enabledUsers, botSubscriptionsCount] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({
                where: {
                    verified: true
                }
            }),
            this.prisma.user.count({
                where: {
                    enabled: true
                }
            }),
            this.prisma.botSubscription.count()
        ]);

        return {
            total_users: totalUsers,
            verified_users: verifiedUsers,
            enabled_users: enabledUsers,
            bot_subscriptions_count: botSubscriptionsCount
        };
    }

}