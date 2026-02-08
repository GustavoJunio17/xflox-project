import { PrismaClient, Sector } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const rawConnection = process.env.DATABASE_URL || '';
const connectionString = rawConnection.replace(/^"(.*)"$/, '$1');
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export class SectorsRepository {
  async create(data: any): Promise<Sector> {
    return prisma.sector.create({ data });
  }

  async findAll() {
    return prisma.sector.findMany({ include: { users: true } });
  }

  async findById(id: string) {
    return prisma.sector.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return prisma.sector.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.sector.delete({ where: { id } });
  }
}

export const sectorsRepository = new SectorsRepository();
