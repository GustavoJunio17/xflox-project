import express from 'express';
import cors from 'cors';
import { userRoutes } from './modules/users/users.routes';
import { authRoutes } from './modules/auth/auth.routes';
import { sectorsRoutes } from './modules/sectors/sectors.routes';
import authMiddleware from './shared/middlewares/auth.middleware';

const app = express();

// Middlewares essenciais
app.use(cors());
app.use(express.json()); // Permite que a API receba JSON no corpo da requisição

// Middleware de autenticação global
app.use(authMiddleware);

// Registro das Rotas do XFlow
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/sectors', sectorsRoutes);

// Rota de Health Check (para saber se a API está viva)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'XFlow API is running' });
});

export { app };
export default app;