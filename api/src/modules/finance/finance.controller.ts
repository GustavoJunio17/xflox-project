import { Request, Response } from 'express';
import { financeService } from './finance.service';

export class FinanceController {
  async cashflow(req: Request, res: Response) {
    try {
      const { from, to, sectorId } = req.query as any;
      const data = await financeService.cashflow({ from, to, sectorId });
      return res.json({ success: true, data });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export const financeController = new FinanceController();
