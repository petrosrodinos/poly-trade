import prisma from '../../../core/prisma/prisma-client';
import { User } from '@prisma/client';

export class UsersService {

  private prisma: any;

  constructor() {
    this.prisma = prisma;
  }


  async findByUuid(uuid: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        uuid: uuid
      }
    });
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