import prisma from '../../core/prisma/prisma-client';
import { AdminStats } from './admin.interfaces';

export class AdminService {
    private prisma: any;

    constructor() {
        this.prisma = prisma;

    }

    async getAdminStats(): Promise<AdminStats> {
        const [totalUsers, verifiedUsers, enabledUsers, subscriptions_count, active_subscriptions_count, subscriptions_amount] = await Promise.all([
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
            this.prisma.botSubscription.count(),
            this.prisma.botSubscription.count({
                where: {
                    active: true
                }
            }),
            this.prisma.botSubscription.aggregate({
                where: {
                    active: true
                },
                _sum: {
                    amount: true
                }
            })
        ]);

        return {
            total_users: totalUsers,
            verified_users: verifiedUsers,
            enabled_users: enabledUsers,
            subscriptions_count: subscriptions_count,
            active_subscriptions_count: active_subscriptions_count,
            subscriptions_amount: subscriptions_amount._sum.amount || 0
        };
    }

}