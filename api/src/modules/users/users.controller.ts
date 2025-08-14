import { Request, Response } from 'express';
import { LoginSchema, RegisterSchema } from './dto/auth.dto';
import { UsersService } from './users.service';
import { AuthService } from './services/auth.service';
import { AuthenticatedRequest } from '../../shared/middleware/auth.middleware';

export class UsersController {
  private usersService: UsersService;
  private authService: AuthService;

  constructor() {
    this.usersService = new UsersService();
    this.authService = new AuthService();
  }


  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = RegisterSchema.parse(req.body);
      const result = await this.authService.register(validatedData);
      res.status(201).json(result);
    } catch (error: any) {
      if (error.message === 'Username already exists') {
        res.status(409).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'Failed to register user', error: error.message });
      }
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = LoginSchema.parse(req.body);
      const result = await this.authService.login(validatedData);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Invalid credentials') {
        res.status(401).json({ message: 'Invalid username or password' });
      } else {
        res.status(400).json({ message: 'Login failed', error: error.message });
      }
    }
  };

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