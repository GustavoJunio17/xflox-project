import { Router } from 'express';
import { goalsController } from './goals.controller';

const router = Router();

router.post('/', (req, res) => goalsController.create(req, res));
router.get('/', (req, res) => goalsController.list(req, res));
router.get('/:id', (req, res) => goalsController.get(req, res));
router.put('/:id', (req, res) => goalsController.update(req, res));
router.delete('/:id', (req, res) => goalsController.remove(req, res));

export const goalsRoutes = router;
