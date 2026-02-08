import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const rawConnection = process.env.DATABASE_URL || '';
const connectionString = rawConnection.replace(/^"(.*)"$/, '$1');
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export class FinanceService {
  // Aggregates payments into inflows/outflows per month
  async cashflow(opts?: { from?: string; to?: string; sectorId?: string }) {
    const where: any = {};
    if (opts?.sectorId) where.sectorId = opts.sectorId;
    if (opts?.from || opts?.to) {
      where.dueDate = {} as any;
      if (opts.from) where.dueDate.gte = new Date(opts.from);
      if (opts.to) where.dueDate.lte = new Date(opts.to);
    }

    const payments = await prisma.payment.findMany({ where, select: { amount: true, dueDate: true, category: true } });

    // Determine months range: if no filters, use last 6 months
    let months: string[] = [];
    if (opts?.from && opts?.to) {
      const start = new Date(opts.from);
      const end = new Date(opts.to);
      const iter = new Date(start.getFullYear(), start.getMonth(), 1);
      while (iter <= end) {
        months.push(monthKey(iter));
        iter.setMonth(iter.getMonth() + 1);
      }
    } else {
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push(monthKey(d));
      }
    }

    const map: Record<string, { inflow: number; outflow: number }> = {};
    months.forEach((m) => (map[m] = { inflow: 0, outflow: 0 }));

    for (const p of payments) {
      const d = new Date(p.dueDate);
      const key = monthKey(d);
      if (!(key in map)) map[key] = { inflow: 0, outflow: 0 };

      const cat = (p.category || '').toLowerCase();
      const isInflow = /receita|entrada|inflow|credit/i.test(cat);
      if (isInflow) map[key].inflow += p.amount;
      else map[key].outflow += p.amount;
    }

    const labels = Object.keys(map).sort();
    const inflows = labels.map((l) => parseFloat(map[l].inflow.toFixed(2)));
    const outflows = labels.map((l) => parseFloat(map[l].outflow.toFixed(2)));

    return { labels, inflows, outflows };
  }
}

export const financeService = new FinanceService();
