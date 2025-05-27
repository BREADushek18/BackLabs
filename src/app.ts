import express from 'express';
import { connectDB } from './config/db';
import dotenv from 'dotenv';
import { authRoutes } from './routes/authRoutes';
import { pingRoutes } from './routes/pingRoutes';
import courseRoutes from './routes/courseRoutes';
import tagRoutes from './routes/tagRoutes';
import courseFavouriteRoutes from './routes/courseFavouriteRoutes';
import lessonRoutes from './routes/lessonRoutes';
import commentRoutes from './routes/commentRoutes';
import enrollmentRoutes from './routes/enrollmentRoutes';

dotenv.config();
const PORT = process.env.PORT || 3000;

connectDB();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', pingRoutes);
app.use('/api', courseRoutes);
app.use('/api', tagRoutes);
app.use('/api/course-favourites', courseFavouriteRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/enrollments', enrollmentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
