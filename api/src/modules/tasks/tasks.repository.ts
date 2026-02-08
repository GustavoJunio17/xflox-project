import { PrismaClient, Task } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const rawConnection = process.env.DATABASE_URL || '';
const connectionString = rawConnection.replace(/^"(.*)"$/, '$1');
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export class TasksRepository {
  async create(data: any): Promise<Task> {
    return prisma.task.create({ data });
  }

  async findAll(filters?: any) {
    const where: any = {};
    if (filters?.sectorId) where.sectorId = filters.sectorId;
    if (filters?.assigneeId) where.assigneeId = filters.assigneeId;
    return prisma.task.findMany({ where, include: { assignee: true, sector: true } });
  }

  async findById(id: string) {
    return prisma.task.findUnique({ where: { id }, include: { assignee: true, sector: true } });
  }

  async update(id: string, data: any) {
    return prisma.task.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.task.delete({ where: { id } });
  }
}

export const tasksRepository = new TasksRepository();
