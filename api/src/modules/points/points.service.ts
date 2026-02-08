import { pointsRepository } from './points.repository';

export class PointsService {
  private repo = pointsRepository;

  async award(userId: string | undefined, points: number, reason: string) {
    if (!userId) return null;
    return this.repo.create({ userId, points, reason });
  }

  async top10Month(date = new Date()) {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    const rows: any = await this.repo.sumByUserBetween(start, end);
    return rows;
  }
}

export const pointsService = new PointsService();
