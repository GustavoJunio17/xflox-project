import { PrismaClient, Payment } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const rawConnection = process.env.DATABASE_URL || '';
const connectionString = rawConnection.replace(/^"(.*)"$/, '$1');
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export class PaymentsRepository {
  async create(data: any): Promise<Payment> {
    return prisma.payment.create({ data });
  }

  async findAll(filters?: any) {
    const where: any = {};
    if (filters?.sectorId) where.sectorId = filters.sectorId;
    if (filters?.from || filters?.to) {
      where.dueDate = {} as any;
      if (filters.from) where.dueDate.gte = new Date(filters.from);
      if (filters.to) where.dueDate.lte = new Date(filters.to);
    }
    return prisma.payment.findMany({ where, include: { sector: true, file: true } });
  }

  async findById(id: string) {
    return prisma.payment.findUnique({ where: { id }, include: { sector: true, file: true } });
  }

  async update(id: string, data: any) {
    return prisma.payment.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.payment.delete({ where: { id } });
  }
}

export const paymentsRepository = new PaymentsRepository();
