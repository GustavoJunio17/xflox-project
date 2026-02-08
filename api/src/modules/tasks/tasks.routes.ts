import { Router } from 'express';
import { tasksController } from './tasks.controller';

const tasksRoutes = Router();

tasksRoutes.post('/', (req, res) => tasksController.create(req, res));
tasksRoutes.get('/', (req, res) => tasksController.list(req, res));
tasksRoutes.get('/:id', (req, res) => tasksController.get(req, res));
tasksRoutes.put('/:id', (req, res) => tasksController.update(req, res));
tasksRoutes.delete('/:id', (req, res) => tasksController.remove(req, res));

export { tasksRoutes };
