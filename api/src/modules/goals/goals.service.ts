import { goalsRepository } from './goals.repository';

class GoalsService {
  async create(payload: any) {
    const data = {
      title: payload.title,
      description: payload.description || null,
      targetDate: payload.targetDate ? new Date(payload.targetDate) : null,
      ownerId: payload.ownerId,
      points: payload.points || 0,
      achieved: false,
    };
    return goalsRepository.create(data);
  }

  async list() {
    return goalsRepository.findAll();
  }

  async get(id: string) {
    return goalsRepository.findById(id);
  }

  async update(id: string, payload: any) {
    const data: any = { ...payload };
    if (payload.targetDate) data.targetDate = new Date(payload.targetDate);
    return goalsRepository.update(id, data);
  }

  async remove(id: string) {
    return goalsRepository.delete(id);
  }
}

export const goalsService = new GoalsService();
