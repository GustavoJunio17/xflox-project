import { Router } from 'express';
import { paymentsController } from './payments.controller';
import fileUpload from '../../shared/middlewares/upload.middleware';

const paymentsRoutes = Router();

paymentsRoutes.post('/', fileUpload, (req, res) => paymentsController.create(req, res));
paymentsRoutes.get('/', (req, res) => paymentsController.list(req, res));
paymentsRoutes.get('/:id', (req, res) => paymentsController.get(req, res));
paymentsRoutes.put('/:id', (req, res) => paymentsController.update(req, res));
paymentsRoutes.delete('/:id', (req, res) => paymentsController.remove(req, res));

export { paymentsRoutes };
