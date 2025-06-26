import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import courseRoutes from './routes/courseRoutes';
import tagRoutes from './routes/tagRoutes';
import courseFavouriteRoutes from './routes/courseFavouriteRoutes';
import lessonRoutes from './routes/lessonRoutes';
import commentRoutes from './routes/commentRoutes';
import enrollmentRoutes from './routes/enrollmentRoutes';
import enrollmentStatusRoutes from './routes/enrollmentStatusRoutes';
import { pingRoutes } from './routes/pingRoutes';
import { initRabbit } from './utils/rabbitmq';
import { startEnrollmentConsumer } from './consumers/enrollmentConsumer';

dotenv.config();
const PORT = process.env.PORT || 3002;

console.log('MONGO_URL from .env:', process.env.MONGO_URL);

async function bootstrap() {
  await connectDB();
  await initRabbit();
  startEnrollmentConsumer();

  const app = express();
  app.use(express.json());

  app.use('/api', pingRoutes);
  app.use('/api', courseRoutes);
  app.use('/api', tagRoutes);
  app.use('/api/course-favourites', courseFavouriteRoutes);
  app.use('/api/lessons', lessonRoutes);
  app.use('/api/comments', commentRoutes);
  app.use('/api/enrollments', enrollmentRoutes);
  app.use('/api/enrollments', enrollmentStatusRoutes);

  app.listen(PORT, () => {
    console.log(`Courses service is running on http://localhost:${PORT}`);
  });
}

bootstrap();
