import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { LoginDto, RegisterDto, JwtPayload, AuthResponse } from '../dto/auth.dto';
import prisma from '../../../core/prisma/prisma-client';
import { v4 as uuidv4 } from 'uuid';
import { UserErrorCodes } from '../../../shared/errors/user';

export class AuthService {
    private jwtSecret: string;
    private jwtExpiresIn: string;
    private prisma: any;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1y';
        this.prisma = prisma;
    }

    async register(registerDto: RegisterDto): Promise<AuthResponse> {
        const existingUser = await this.prisma.user.findUnique({
            where: {
                username: registerDto.username
            }
        });
        if (existingUser) {
            throw new Error(UserErrorCodes.USER_ALREADY_EXISTS);
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 12);

        const newUser = await this.prisma.user.create({
            data: {
                uuid: uuidv4(),
                username: registerDto.username,
                password: hashedPassword,
            }
        });

        const token = this.generateToken({
            uuid: newUser.uuid,
            username: newUser.username,
            role: newUser.role
        });

        return {
            user: {
                uuid: newUser.uuid,
                username: newUser.username,
                role: newUser.role
            },
            token
        };
    }

    async login(loginDto: LoginDto): Promise<AuthResponse> {
        const user = await this.prisma.user.findUnique({
            where: {
                username: loginDto.username
            }
        });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = this.generateToken({
            uuid: user.uuid,
            username: user.username,
            role: user.role
        });

        return {
            user: {
                uuid: user.uuid,
                username: user.username,
                role: user.role
            },
            token
        };
    }

    private generateToken(payload: JwtPayload): string {
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
