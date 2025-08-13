import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../modules/users/services/auth.service';
import { JwtPayload } from '../../modules/users/dto/auth.dto';

interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

export class AuthMiddleware {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401).json({ message: 'Access token required' });
                return;
            }

            const token = authHeader.substring(7);
            const payload = this.authService.verifyToken(token);

            req.user = payload;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid or expired token' });
        }
    };

    requireRole = (allowedRoles: string[]) => {
        return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }

            if (!allowedRoles.includes(req.user.role)) {
                res.status(403).json({ message: 'Insufficient permissions' });
                return;
            }

            next();
        };
    };

    requireAdmin = this.requireRole(['ADMIN']);
    requireUser = this.requireRole(['USER', 'ADMIN']);
    requireWebhook = this.requireRole(['WEBHOOK', 'ADMIN']);
}

export const authMiddleware = new AuthMiddleware();
export { AuthenticatedRequest };
