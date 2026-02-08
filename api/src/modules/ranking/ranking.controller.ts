import { Request, Response } from 'express';
import { pointsService } from '../points/points.service';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const rawConnection = process.env.DATABASE_URL || '';
const connectionString = rawConnection.replace(/^"(.*)"$/, '$1');
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export class RankingController {
  async top10(req: Request, res: Response) {
    try {
      const rows: any = await pointsService.top10Month();
      // rows come as array of objects with userId and total
      const result = await Promise.all(rows.map(async (r: any) => {
        const user = await prisma.user.findUnique({ where: { id: r.userId } });
        return { userId: r.userId, total: Number(r.total || 0), user: user ? { id: user.id, name: user.name, email: user.email } : null };
      }));
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export const rankingController = new RankingController();
