import { Router } from 'express';
import { authController } from './auth.controller';

const authRoutes = Router();

authRoutes.post('/login', (req, res) => authController.login(req, res));

export { authRoutes };
