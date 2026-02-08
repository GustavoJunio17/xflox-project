import { Router } from 'express';
import { UsersController } from './users.controller';

const userRoutes = Router();
const controller = new UsersController();

userRoutes.post('/', (req, res) => controller.create(req, res));
userRoutes.get('/', (req, res) => controller.list(req, res));
userRoutes.put('/:id/role', (req, res) => controller.changeRole(req, res));

export { userRoutes };