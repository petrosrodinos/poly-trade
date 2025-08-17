import { Request, Response } from 'express';
import { UsersService } from '../services/users.service';
import { AuthenticatedRequest } from '../../../shared/middleware/auth.middleware';

export class UsersController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }


  deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const uuid = req.user!.uuid;
      const result = await this.usersService.deleteUser(uuid);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
  };

  deleteAllUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const result = await this.usersService.deleteAllUsers();
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to delete all users', error: error.message });
    }
  };




} 