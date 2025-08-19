import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { AuthenticatedRequest } from '../../shared/middleware/auth.middleware';

export class AdminController {
    private adminService: AdminService;

    constructor() {
        this.adminService = new AdminService();
    }

    getAdminStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const result = await this.adminService.getAdminStats();
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ message: 'Failed to get admin stats', error: error.message });
        }
    };
}
