import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db';
import courseRoutes from './src/routes/courseRoutes';
import tagRoutes from './src/routes/tagRoutes';
import courseFavouriteRoutes from './src/routes/courseFavouriteRoutes';
import lessonRoutes from './src/routes/lessonRoutes';
import commentRoutes from './src/routes/commentRoutes';
import enrollmentRoutes from './src/routes/enrollmentRoutes';
import { pingRoutes } from './src/routes/pingRoutes';

dotenv.config();
const PORT = process.env.PORT || 3002;

connectDB();

const app = express();
app.use(express.json());

app.use('/api', pingRoutes);
app.use('/api', courseRoutes);
app.use('/api', tagRoutes);
app.use('/api/course-favourites', courseFavouriteRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/enrollments', enrollmentRoutes);

app.listen(PORT, () => {
  console.log(`Courses service is running on http://localhost:${PORT}`);
});
