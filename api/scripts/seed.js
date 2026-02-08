require('dotenv/config');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const rawConnection = process.env.DATABASE_URL || '';
const connectionString = rawConnection.replace(/^\"(.*)\"$/, '$1');
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
  try {
    console.log('Seeding database...');

    // Create sectors
    const engineering = await prisma.sector.upsert({ where: { name: 'Engenharia' }, update: {}, create: { name: 'Engenharia' } });
    const marketing = await prisma.sector.upsert({ where: { name: 'Marketing' }, update: {}, create: { name: 'Marketing' } });
    const finance = await prisma.sector.upsert({ where: { name: 'Financeiro' }, update: {}, create: { name: 'Financeiro' } });

    // Create users (passwords hashed)
    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash('senha123', salt);
    const gestorPass = await bcrypt.hash('senha123', salt);
    const colaboradorPass = await bcrypt.hash('senha123', salt);

    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: { name: 'Admin User', role: 'ADMIN', password: adminPass, sectorId: engineering.id },
      create: { email: 'admin@example.com', name: 'Admin User', password: adminPass, role: 'ADMIN', sectorId: engineering.id },
    });

    const gestor = await prisma.user.upsert({
      where: { email: 'gestor@example.com' },
      update: { name: 'Gestor User', role: 'GESTOR', password: gestorPass, sectorId: marketing.id },
      create: { email: 'gestor@example.com', name: 'Gestor User', password: gestorPass, role: 'GESTOR', sectorId: marketing.id },
    });

    const colab = await prisma.user.upsert({
      where: { email: 'colab@example.com' },
      update: { name: 'Colaborador User', role: 'COLABORADOR', password: colaboradorPass, sectorId: finance.id },
      create: { email: 'colab@example.com', name: 'Colaborador User', password: colaboradorPass, role: 'COLABORADOR', sectorId: finance.id },
    });

    // Create goals (no points field on model; points tracked via PointsLog)
    const goal1 = await prisma.goal.create({ data: { title: 'Aumentar receita 10%', description: 'Meta de crescimento trimestral', ownerId: admin.id, target: 'Aumentar receita', dueDate: new Date(Date.now() + 1000*60*60*24*30) } });
    const goal2 = await prisma.goal.create({ data: { title: 'Lançar campanha marketing', description: 'Campanha Q1', ownerId: gestor.id, collective: true, target: 'Campanha Q1', dueDate: new Date(Date.now() + 1000*60*60*24*20) } });

    // Create tasks (one on-time complete, one pending)
    const task1 = await prisma.task.create({ data: { title: 'Relatório mensal', description: 'Gerar relatório', dueDate: new Date(Date.now()+1000*60*60*24*5), assigneeId: colab.id, sectorId: finance.id } });
    const task2 = await prisma.task.create({ data: { title: 'Preparar landing page', description: 'Design e copy', dueDate: new Date(Date.now()+1000*60*60*24*3), assigneeId: gestor.id, sectorId: marketing.id } });

    // Mark task1 as completed on-time and create points log
    const completedAt = new Date();
    await prisma.task.update({ where: { id: task1.id }, data: { status: 'CONCLUIDA', completedAt } });
    await prisma.pointsLog.create({ data: { userId: colab.id, points: 50, reason: 'Task completed on-time' } });

    // Example points for goal achievements
    await prisma.pointsLog.create({ data: { userId: admin.id, points: 500, reason: 'Goal created: ' + goal1.title } });
    await prisma.pointsLog.create({ data: { userId: gestor.id, points: 300, reason: 'Goal created: ' + goal2.title } });

    console.log('Seed finished. Users created:');
    console.log('- admin@example.com / senha123 (ADMIN)');
    console.log('- gestor@example.com / senha123 (GESTOR)');
    console.log('- colab@example.com / senha123 (COLABORADOR)');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
