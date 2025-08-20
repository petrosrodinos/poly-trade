import jwt, { JwtPayload } from 'jsonwebtoken';

export class JwtTokenService {
    private readonly jwtSecret: string;
    private readonly jwtExpiresIn: string;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || '';
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1y';
    }

    generateToken(payload: JwtPayload): string {
        return jwt.sign(payload, this.jwtSecret, {
            expiresIn: this.jwtExpiresIn
        } as jwt.SignOptions);
    }

    verifyToken(token: string): JwtPayload {
        try {
            return jwt.verify(token, this.jwtSecret) as JwtPayload;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}