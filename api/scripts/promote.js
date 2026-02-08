require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const rawConnection = process.env.DATABASE_URL || '';
const connectionString = rawConnection.replace(/^"(.*)"$/, '$1');
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });
const email = process.argv[2] || 'admin@example.com';

async function main(){
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.error('User not found:', email);
      process.exit(1);
    }

    const updated = await prisma.user.update({ where: { email }, data: { role: 'ADMIN' } });
    console.log('Promoted:', updated.email, '->', updated.role);
  } catch (err) {
    console.error('Error promoting user:', err.message || err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
