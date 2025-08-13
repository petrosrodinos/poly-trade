import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface OriginProtectionOptions {
    allowedOrigins?: string[];
    allowedIPs?: string[];
    allowedUserAgents?: string[];
    requireSpecificHeaders?: Record<string, string>;
    allowLocalhost?: boolean;
}

export class OriginProtectionMiddleware {
    private options: OriginProtectionOptions;

    constructor(options: OriginProtectionOptions = {}) {
        this.options = {
            allowedOrigins: options.allowedOrigins || [],
            allowedIPs: options.allowedIPs || [],
            allowedUserAgents: options.allowedUserAgents || [],
            requireSpecificHeaders: options.requireSpecificHeaders || {},
            allowLocalhost: options.allowLocalhost || false,
            ...options
        };
    }

    protect = (req: Request, res: Response, next: NextFunction): void => {
        try {
            const clientIP = this.getClientIP(req);
            const origin = req.get('origin') || req.get('referer') || '';
            const userAgent = req.get('user-agent') || '';
            const forwardedFor = req.get('x-forwarded-for');


            if (this.options.allowLocalhost && this.isLocalhost(clientIP)) {
                next();
                return;
            }

            if (this.options.allowedIPs && this.options.allowedIPs.length > 0) {
                const isIPAllowed = this.checkIP(clientIP, forwardedFor);
                if (!isIPAllowed) {
                    logger.warn(`Blocked request from unauthorized IP: ${clientIP}, Forwarded: ${forwardedFor}`);
                    res.status(403).json({
                        message: 'Access denied: unauthorized IP address',
                        timestamp: new Date().toISOString()
                    });
                    return;
                }
            }

            if (this.options.allowedOrigins && this.options.allowedOrigins.length > 0) {
                const isOriginAllowed = this.checkOrigin(origin);
                if (!isOriginAllowed) {
                    logger.warn(`Blocked request from unauthorized origin: ${origin}`);
                    res.status(403).json({
                        message: 'Access denied: unauthorized origin',
                        timestamp: new Date().toISOString()
                    });
                    return;
                }
            }

            if (this.options.allowedUserAgents && this.options.allowedUserAgents.length > 0) {
                const isUserAgentAllowed = this.checkUserAgent(userAgent);
                if (!isUserAgentAllowed) {
                    logger.warn(`Blocked request from unauthorized user agent: ${userAgent}`);
                    res.status(403).json({
                        message: 'Access denied: unauthorized user agent',
                        timestamp: new Date().toISOString()
                    });
                    return;
                }
            }

            if (this.options.requireSpecificHeaders && Object.keys(this.options.requireSpecificHeaders).length > 0) {
                const hasRequiredHeaders = this.checkRequiredHeaders(req);
                if (!hasRequiredHeaders) {
                    logger.warn('Blocked request missing required headers');
                    res.status(403).json({
                        message: 'Access denied: missing required headers',
                        timestamp: new Date().toISOString()
                    });
                    return;
                }
            }

            next();
        } catch (error) {
            logger.error('Origin protection error:', error);
            res.status(500).json({
                message: 'Internal server error during origin verification',
                timestamp: new Date().toISOString()
            });
        }
    };

    private getClientIP(req: Request): string {
        const forwarded = req.get('x-forwarded-for');
        if (forwarded) {
            return forwarded.split(',')[0].trim();
        }
        return req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
    }

    private isLocalhost(ip: string): boolean {
        const localhostPatterns = [
            '127.0.0.1',
            '::1',
            'localhost',
            '::ffff:127.0.0.1'
        ];
        return localhostPatterns.includes(ip) || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.');
    }

    private checkIP(clientIP: string, forwardedFor?: string): boolean {
        const ipsToCheck = [clientIP];
        if (forwardedFor) {
            ipsToCheck.push(...forwardedFor.split(',').map(ip => ip.trim()));
        }

        return this.options.allowedIPs?.some(allowedIP => {
            return ipsToCheck.some(ip => {
                if (allowedIP.includes('/')) {
                    return this.isIPInCIDR(ip, allowedIP);
                }
                return ip === allowedIP || ip.includes(allowedIP);
            });
        }) || false;
    }

    private checkOrigin(origin: string): boolean {
        if (!origin) return (this.options.allowedOrigins?.length || 0) === 0;

        return this.options.allowedOrigins?.some(allowedOrigin => {
            if (allowedOrigin === '*') return true;
            if (allowedOrigin.startsWith('*.')) {
                const domain = allowedOrigin.substring(2);
                return origin.endsWith(domain);
            }
            return origin === allowedOrigin || origin.includes(allowedOrigin);
        }) || false;
    }

    private checkUserAgent(userAgent: string): boolean {
        if (!userAgent) return (this.options.allowedUserAgents?.length || 0) === 0;

        return this.options.allowedUserAgents?.some(allowedUA => {
            if (allowedUA === '*') return true;
            return userAgent.toLowerCase().includes(allowedUA.toLowerCase());
        }) || false;
    }

    private checkRequiredHeaders(req: Request): boolean {
        if (!this.options.requireSpecificHeaders) return true;

        return Object.entries(this.options.requireSpecificHeaders).every(([header, value]) => {
            const headerValue = req.get(header);
            if (value === '*') return !!headerValue;
            return headerValue === value;
        });
    }

    private isIPInCIDR(ip: string, cidr: string): boolean {
        try {
            const [network, prefixLength] = cidr.split('/');
            const ipNum = this.ipToNumber(ip);
            const networkNum = this.ipToNumber(network);
            const mask = (0xffffffff << (32 - parseInt(prefixLength))) >>> 0;

            return (ipNum & mask) === (networkNum & mask);
        } catch {
            return false;
        }
    }

    private ipToNumber(ip: string): number {
        return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
    }
}

export const createOriginProtection = (options: OriginProtectionOptions) => {
    const middleware = new OriginProtectionMiddleware(options);
    return middleware.protect;
};

export const createTradingViewProtection = () => {
    return createOriginProtection({
        allowedIPs: process.env.TRADINGVIEW_ALLOWED_IPS?.split(',') || [
            '52.89.214.238',
            '34.212.75.30',
            '54.218.53.128',
            '52.32.178.7'
        ],
        allowedUserAgents: process.env.TRADINGVIEW_ALLOWED_USER_AGENTS?.split(',') || [
            'Go-http-client',
            'TradingView'
        ],
        allowLocalhost: process.env.NODE_ENV === 'development',
        requireSpecificHeaders: {
            'content-type': '*'
        }
    });
};
