import { Request, Response } from 'express';
import { UsersService } from '../services/users.service';
import { AuthenticatedRequest } from '../../../shared/middleware/auth.middleware';

export class UsersController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  getUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const result = await this.usersService.getUsers();
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to get users', error: error.message });
    }
  };

  getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {

    try {
      const result = await this.usersService.getMe(req.user!.uuid);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to get me', error: error.message });
    }
  };

  updateUserAdmin = async (req: AuthenticatedRequest, res: Response): Promise<void> => {

    try {

      const uuid = req.params.uuid;
      const result = await this.usersService.updateUserAdmin(uuid, req.body);
      res.status(200).json(result);

    } catch (error: any) {
      res.status(500).json({ message: 'Failed to update user', error: error.message });
    }
  };

  updateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const result = await this.usersService.updateUser(req.user!.uuid, req.body);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to update user', error: error.message });
    }
  };

  deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const uuid = req.params.uuid;
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