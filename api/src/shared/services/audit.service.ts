import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const rawConnection = process.env.DATABASE_URL || '';
const connectionString = rawConnection.replace(/^"(.*)"$/, '$1');
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export class AuditService {
  async log(params: { userId?: string; action: string; targetType?: string; targetId?: string; metadata?: any }) {
    const { userId, action, targetType, targetId, metadata } = params;
    return prisma.auditLog.create({
      data: {
        userId,
        action,
        targetType,
        targetId,
        metadata,
      },
    });
  }
}

export const auditService = new AuditService();
