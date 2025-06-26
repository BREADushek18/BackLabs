import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { authRoutes } from './routes/authRoutes';
import { initRabbit } from './utils/rabbitmq';
import { startUserConsumer } from './rabbit/consumer';

dotenv.config();

async function bootstrap() {
  await connectDB();
  await initRabbit();
  await startUserConsumer();

  const app = express();
  app.use(express.json());

  app.use('/api/auth', authRoutes);

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`User service running on http://localhost:${PORT}`);
  });
}

bootstrap();
