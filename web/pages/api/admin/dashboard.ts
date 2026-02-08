import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Minimal stub: the real implementation should call the backend API.
  // For now return synthetic data so UI works immediately.
  const cashflow = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    inflows: [10000, 12000, 8000, 14000, 9000, 16000],
    outflows: [7000, 9000, 6000, 8000, 5000, 7000],
  };
  const tasks = { pending: 12, dueSoon: 3 };
  res.status(200).json({ cashflow, tasks });
}
