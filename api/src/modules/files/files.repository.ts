import { PrismaClient, File } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const rawConnection = process.env.DATABASE_URL || '';
const connectionString = rawConnection.replace(/^"(.*)"$/, '$1');
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export class FilesRepository {
  async create(data: any): Promise<File> {
    return prisma.file.create({ data });
  }

  async delete(id: string) {
    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) return null;
    try {
      fs.unlinkSync(path.resolve(file.path));
    } catch (e) {}
    return prisma.file.delete({ where: { id } });
  }
}

export const filesRepository = new FilesRepository();
