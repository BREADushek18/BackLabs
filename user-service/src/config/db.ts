import mongoose from 'mongoose';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

const connectDB = async () => {
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      await mongoose.connect(process.env.MONGO_URI!);
      console.log('MongoDB connected!');
      return;
    } catch (error) {
      attempts++;
      console.error(`MongoDB connection failed (attempt ${attempts}):`, error);
      if (attempts < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
        await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
      } else {
        console.error('Max retries reached. Exiting.');
        process.exit(1);
      }
    }
  }
};

export { connectDB };
