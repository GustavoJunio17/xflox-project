import { Router } from 'express';
import { sectorsController } from './sectors.controller';

const sectorsRoutes = Router();

sectorsRoutes.post('/', (req, res) => sectorsController.create(req, res));
sectorsRoutes.get('/', (req, res) => sectorsController.list(req, res));
sectorsRoutes.put('/:id', (req, res) => sectorsController.update(req, res));
sectorsRoutes.delete('/:id', (req, res) => sectorsController.remove(req, res));

export { sectorsRoutes };
