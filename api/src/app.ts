import express from 'express';
import healthRouter from './routes/health';

const app = express();

app.use(express.json());
app.use('/health', healthRouter);

app.get('/', (req, res) => res.json({ ok: true, name: 'node-project-default' }));

export default app;
