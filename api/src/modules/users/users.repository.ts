import { PrismaClient, User } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const rawConnection = process.env.DATABASE_URL || '';
const connectionString = rawConnection.replace(/^"(.*)"$/, '$1');
// Diagnostic logs (do not print full URL in production)
console.log('[users.repository] DATABASE_URL typeof:', typeof rawConnection, 'hasSurroundingQuotes:', /^".*"$/.test(rawConnection));
const maskConnection = (cs: string) => {
  try {
    return cs.replace(/:(.*)@/, ':***@');
  } catch (e) {
    return '<<invalid connection string>>';
  }
};
console.log('[users.repository] connectionString masked:', maskConnection(connectionString));
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export class UsersRepository {
  async create(data: any): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany({
      include: { sector: true } 
    });
  }

  async update(id: string, data: any): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }
}