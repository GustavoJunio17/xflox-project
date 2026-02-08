import { Request, Response } from 'express';
import { tasksService } from './tasks.service';
import { auditService } from '../../shared/services/audit.service';

export class TasksController {
  private service = tasksService;

  async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const task = await this.service.create(data);
      await auditService.log({ userId: (req as any).user?.id, action: `Criou tarefa ${task.id}`, targetType: 'task', targetId: task.id });
      return res.status(201).json(task);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { sectorId, assigneeId } = req.query as any;
      const tasks = await this.service.list({ sectorId, assigneeId });
      return res.json(tasks);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const task = await this.service.get(req.params.id);
      if (!task) return res.status(404).json({ error: 'Not found' });
      return res.json(task);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const actorId = (req as any).user?.id;
      const updated = await this.service.update(req.params.id, req.body, actorId);
      await auditService.log({ userId: actorId, action: `Atualizou tarefa ${updated.id}`, targetType: 'task', targetId: updated.id });
      return res.json(updated);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const removed = await this.service.remove(req.params.id);
      await auditService.log({ userId: (req as any).user?.id, action: `Deletou tarefa ${req.params.id}`, targetType: 'task', targetId: req.params.id });
      return res.json({ success: true, removed });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}

export const tasksController = new TasksController();
