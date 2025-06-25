import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db';
import { authRoutes } from './src/routes/authRoutes';

dotenv.config();
const PORT = process.env.PORT || 3001;

connectDB();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`User service is running on http://localhost:${PORT}`);
});
