import { Request, Response } from 'express';
import { goalsService } from './goals.service';

class GoalsController {
  async create(req: Request, res: Response) {
    const result = await goalsService.create(req.body);
    res.status(201).json(result);
  }

  async list(req: Request, res: Response) {
    const result = await goalsService.list();
    res.json(result);
  }

  async get(req: Request, res: Response) {
    const { id } = req.params;
    const result = await goalsService.get(id);
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json(result);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const result = await goalsService.update(id, req.body);
    res.json(result);
  }

  async remove(req: Request, res: Response) {
    const { id } = req.params;
    await goalsService.remove(id);
    res.status(204).send();
  }
}

export const goalsController = new GoalsController();
