import bcrypt from 'bcryptjs';
import { ChangePasswordDto, LoginDto, RegisterDto } from '../dto/auth.dto';
import prisma from '../../../core/prisma/prisma-client';
import { v4 as uuidv4 } from 'uuid';
import { UserErrorCodes } from '../../../shared/errors/user';
import { JwtTokenService } from '../../../shared/utils/jwt';
import { AuthResponse } from '../interfaces/auth.interface';

export class AuthService {
    private jwtTokenService: JwtTokenService;
    private prisma: any;

    constructor() {
        this.jwtTokenService = new JwtTokenService();
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

        const token = this.jwtTokenService.generateToken({
            uuid: newUser.uuid,
            username: newUser.username,
            role: newUser.role,
            verified: false,
            enabled: false,
        });

        return {
            user: {
                uuid: newUser.uuid,
                username: newUser.username,
                role: newUser.role,
                verified: false,
                enabled: false,
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

        const token = this.jwtTokenService.generateToken({
            uuid: user.uuid,
            username: user.username,
            role: user.role,
            verified: user.verified,
            enabled: user.enabled,
        });

        return {
            user: {
                uuid: user.uuid,
                username: user.username,
                role: user.role,
                verified: user.verified,
                enabled: user.enabled,
            },
            token
        };
    }

    async changePassword(uuid: string, changePasswordDto: ChangePasswordDto): Promise<void> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { uuid }
            });

            if (!user) {
                throw new Error('User not found');
            }

            const isPasswordValid = await bcrypt.compare(changePasswordDto.old_password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid old password');
            }

            const hashedPassword = await bcrypt.hash(changePasswordDto.new_password, 12);
            await this.prisma.user.update({
                where: { uuid },
                data: { password: hashedPassword }
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

}
