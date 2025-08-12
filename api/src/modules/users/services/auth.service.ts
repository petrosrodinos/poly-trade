import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { LoginDto, RegisterDto, JwtPayload, AuthResponse } from '../dto/auth.dto';
import { UsersService } from '../users.service';
import prisma from '../../../core/prisma/prisma-client';
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
    private usersService: UsersService;
    private jwtSecret: string;
    private jwtExpiresIn: string;
    private prisma: any;

    constructor() {
        this.usersService = new UsersService();
        this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
        this.prisma = prisma;
    }

    async register(registerDto: RegisterDto): Promise<AuthResponse> {
        const existingUser = await this.prisma.user.findUnique({
            where: {
                username: registerDto.username
            }
        });
        if (existingUser) {
            throw new Error('Username already exists');
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
            user_id: newUser.id,
            uuid: newUser.uuid,
            username: newUser.username,
            role: newUser.role
        });

        return {
            user: {
                id: newUser.id,
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
            user_id: user.id,
            uuid: user.uuid,
            username: user.username,
            role: user.role
        });

        return {
            user: {
                id: user.id,
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
