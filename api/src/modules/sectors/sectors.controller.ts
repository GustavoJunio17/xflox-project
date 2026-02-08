import { Request, Response } from 'express';
import { sectorsService } from './sectors.service';
import { auditService } from '../../shared/services/audit.service';

export class SectorsController {
  async create(req: Request, res: Response) {
    try {
      const requester = (req as any).user;
      if (!requester || requester.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Apenas Admin pode criar setores' });
      }

      const sector = await sectorsService.create(req.body);
      await auditService.log({ userId: requester.id, action: `Criou setor ${sector.name}`, targetType: 'sector', targetId: sector.id });
      return res.status(201).json(sector);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const sectors = await sectorsService.listAll();
      return res.json(sectors);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const requester = (req as any).user;
      if (!requester || requester.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Apenas Admin pode atualizar setores' });
      }
      const sector = await sectorsService.update(req.params.id, req.body);
      await auditService.log({ userId: requester.id, action: `Atualizou setor ${sector.name}`, targetType: 'sector', targetId: sector.id });
      return res.json(sector);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const requester = (req as any).user;
      if (!requester || requester.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Apenas Admin pode deletar setores' });
      }
      const sector = await sectorsService.delete(req.params.id);
      await auditService.log({ userId: requester.id, action: `Deletou setor ${sector.name}`, targetType: 'sector', targetId: sector.id });
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}

export const sectorsController = new SectorsController();
