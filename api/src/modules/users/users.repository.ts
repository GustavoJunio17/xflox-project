import { PrismaClient, User } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
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
}