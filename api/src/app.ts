import express from 'express';
import cors from 'cors';
import { userRoutes } from './modules/users/users.routes';

const app = express();

// Middlewares essenciais
app.use(cors());
app.use(express.json()); // Permite que a API receba JSON no corpo da requisição

// Registro das Rotas do XFlow
app.use('/api/v1/users', userRoutes);

// Rota de Health Check (para saber se a API está viva)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'XFlow API is running' });
});

export { app };