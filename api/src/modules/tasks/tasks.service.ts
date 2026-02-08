import { tasksRepository } from './tasks.repository';
import { pointsRepository } from '../points/points.repository';

export class TasksService {
  private repo = tasksRepository;
  private pointsRepo = pointsRepository;

  // Create task
  async create(data: any) {
    return this.repo.create(data);
  }

  async list(filters?: any) {
    return this.repo.findAll(filters);
  }

  async get(id: string) {
    return this.repo.findById(id);
  }

  async update(id: string, data: any, actorId?: string) {
    // If marking completed, set completedAt
    const prev = await this.repo.findById(id);
    const updated = await this.repo.update(id, data);

    // Award points if status transitioned to CONCLUIDA and completedAt is set
    if (prev?.status !== 'CONCLUIDA' && updated.status === 'CONCLUIDA') {
      const completedAt = updated.completedAt ? new Date(updated.completedAt) : new Date();
      const due = new Date(updated.dueDate);
      const withinDeadline = completedAt <= due;
      const points = withinDeadline ? 50 : 10;
      await this.pointsRepo.create({ userId: updated.assigneeId || actorId, points, reason: `Task ${updated.id} completed` });
    }

    return updated;
  }

  async remove(id: string) {
    return this.repo.delete(id);
  }
}

export const tasksService = new TasksService();
