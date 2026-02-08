import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { auditService } from '../../shared/services/audit.service';

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

  async changeRole(req: Request, res: Response) {
    try {
      const requester = (req as any).user;
      if (!requester || requester.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Apenas Admin pode alterar roles' });
      }

      const { id } = req.params;
      const { role } = req.body;
      const updated = await this.service.changeRole(id, role);
      await auditService.log({ userId: requester.id, action: `Alterou role do usuário ${updated.email} para ${role}`, targetType: 'user', targetId: updated.id });
      return res.json(updated);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}