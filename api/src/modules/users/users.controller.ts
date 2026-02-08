import { Request, Response } from 'express';
import { UsersService } from './users.service';

export class UsersController {
  private service = new UsersService();

  async create(req: Request, res: Response) {
    try {
      const user = await this.service.create(req.body);
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const users = await this.service.listAll();
      return res.json(users);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}