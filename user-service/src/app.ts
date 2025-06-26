import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { authRoutes } from './routes/authRoutes';

dotenv.config();
const PORT = process.env.PORT || 3001;

connectDB();

console.log('MONGO_URL from .env:', process.env.MONGO_URL);

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`User service is running on http://localhost:${PORT}`);
});
