import { PrismaClient, Asset } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const rawConnection = process.env.DATABASE_URL || '';
const connectionString = rawConnection.replace(/^"(.*)"$/, '$1');
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export class AssetsRepository {
  async create(data: any): Promise<Asset> {
    return prisma.asset.create({ data });
  }

  async findAll() {
    return prisma.asset.findMany({ include: { invoice: true } });
  }

  async findById(id: string) {
    return prisma.asset.findUnique({ where: { id }, include: { invoice: true } });
  }

  async update(id: string, data: any) {
    return prisma.asset.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.asset.delete({ where: { id } });
  }
}

export const assetsRepository = new AssetsRepository();
