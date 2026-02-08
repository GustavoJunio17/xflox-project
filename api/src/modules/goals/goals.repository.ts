import { PrismaClient, Goal } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const rawConnection = process.env.DATABASE_URL || '';
const connectionString = rawConnection.replace(/^"(.*)"$/, '$1');
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export class GoalsRepository {
  async create(data: any): Promise<Goal> {
    return prisma.goal.create({ data });
  }

  async findAll() {
    return prisma.goal.findMany({ include: { owner: true } });
  }

  async findById(id: string) {
    return prisma.goal.findUnique({ where: { id }, include: { owner: true } });
  }

  async update(id: string, data: any) {
    return prisma.goal.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.goal.delete({ where: { id } });
  }
}

export const goalsRepository = new GoalsRepository();
