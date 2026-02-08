import { Router } from 'express';
import { assetsController } from './assets.controller';
import fileUpload from '../../shared/middlewares/upload.middleware';

const assetsRoutes = Router();

assetsRoutes.post('/', fileUpload, (req, res) => assetsController.create(req, res));
assetsRoutes.get('/', (req, res) => assetsController.list(req, res));
assetsRoutes.get('/:id', (req, res) => assetsController.get(req, res));
assetsRoutes.put('/:id', (req, res) => assetsController.update(req, res));
assetsRoutes.delete('/:id', (req, res) => assetsController.remove(req, res));

export { assetsRoutes };
