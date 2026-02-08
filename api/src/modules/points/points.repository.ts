import { PrismaClient, PointsLog } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const rawConnection = process.env.DATABASE_URL || '';
const connectionString = rawConnection.replace(/^"(.*)"$/, '$1');
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export class PointsRepository {
  async create(data: any): Promise<PointsLog> {
    return prisma.pointsLog.create({ data });
  }

  async sumByUserBetween(start: Date, end: Date) {
    return prisma.$queryRaw`
      SELECT "userId", SUM(points) as total
      FROM points_logs
      WHERE "createdAt" >= ${start.toISOString()}::timestamptz AND "createdAt" <= ${end.toISOString()}::timestamptz
      GROUP BY "userId"
      ORDER BY total DESC
      LIMIT 10
    ` as any;
  }
}

export const pointsRepository = new PointsRepository();
