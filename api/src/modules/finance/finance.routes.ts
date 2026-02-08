import { Router } from 'express';
import { financeController } from './finance.controller';

const financeRoutes = Router();

financeRoutes.get('/cashflow', (req, res) => financeController.cashflow(req, res));

export { financeRoutes };
