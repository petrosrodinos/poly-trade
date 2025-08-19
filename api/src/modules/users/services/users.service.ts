import prisma from '../../../core/prisma/prisma-client';
import { User } from '@prisma/client';
import { UpdateUserDto } from '../dto/auth.dto';

export class UsersService {

  private prisma: any;

  constructor() {
    this.prisma = prisma;
  }


  async getUsers(): Promise<User[]> {
    try {
      return await this.prisma.user.findMany({
        select: {
          uuid: true,
          username: true,
          role: true,
          verified: true,
          enabled: true,
          createdAt: true,
        }
      });
    } catch (error) {
      throw new Error('Failed to get users');
    }
  }

  async getMe(uuid: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: {
          uuid: uuid
        },
        select: {
          uuid: true,
          username: true,
          role: true,
          verified: true,
          enabled: true,
          createdAt: true,
        }
      });
    } catch (error) {
      throw new Error('Failed to get me');
    }
  }

  async updateUser(uuid: string, data: UpdateUserDto): Promise<User | null> {
    try {
      return await this.prisma.user.update({
        where: { uuid: uuid },
        data: data
      });
    } catch (error) {
      throw new Error('Failed to update user');
    }
  }

  async findByUuid(uuid: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: {
          uuid: uuid
        }
      });
    } catch (error) {
      throw new Error('Failed to find user by uuid');
    }
  }

  async deleteUser(uuid: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: {
          uuid: uuid
        }
      });
      return true;
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  }

  async deleteAllUsers(): Promise<boolean> {
    try {
      await this.prisma.user.deleteMany();
      return true;
    } catch (error) {
      throw new Error('Failed to delete all users');
    }
  }


} 