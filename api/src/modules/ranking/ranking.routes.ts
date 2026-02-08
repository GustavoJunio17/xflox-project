import { Router } from 'express';
import { rankingController } from './ranking.controller';

const rankingRoutes = Router();

rankingRoutes.get('/top10', (req, res) => rankingController.top10(req, res));

export { rankingRoutes };
