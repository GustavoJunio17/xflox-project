import { app } from './app';
import 'dotenv/config';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 XFlow API rodando na porta ${PORT}`);
});