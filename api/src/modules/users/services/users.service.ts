import prisma from '../../../core/prisma/prisma-client';
import { UpdateUserDto } from '../dto/auth.dto';
import { BotSubscriptionsService } from '../../bot-subscriptions/bot-subscriptions.service';
import { User } from '../interfaces/user.interface';
import { AccountService } from '../../account/account.service';

export class UsersService {

  private prisma: any;
  private botSubscriptionsService: BotSubscriptionsService;
  private accountService: AccountService;

  constructor() {
    this.prisma = prisma;
    this.botSubscriptionsService = new BotSubscriptionsService();
    this.accountService = new AccountService();
  }


  async getUsers(): Promise<User[]> {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          uuid: true,
          username: true,
          role: true,
          verified: true,
          enabled: true,
          createdAt: true,
          subscriptions: true,
          meta: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      const accounts = await Promise.all(users.map((user: User) => this.accountService.getAccount(user.uuid)));

      users.forEach((user: User, index: number) => {
        user.balance = accounts[index].totalWalletBalance;
        user.profit = accounts[index].income.netProfit;
      });

      return users;
    } catch (error) {
      console.log(error);
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
          meta: true,
        }
      });
    } catch (error) {
      throw new Error('Failed to get me');
    }
  }

  async updateUser(uuid: string, data: UpdateUserDto): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          uuid: uuid
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (data.meta && user.meta) {
        data.meta = {
          ...user.meta,
          ...data.meta
        };
      }

      if (!data.enabled) {
        await this.botSubscriptionsService.stopAllBotSubscriptions(uuid);
      } else {
        // await this.botSubscriptionsService.startAllBotSubscriptions(uuid);
      }

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
      console.log(error);
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