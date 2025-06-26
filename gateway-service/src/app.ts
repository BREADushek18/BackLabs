import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import { initRabbit } from './utils/rabbitmq';
import { startGatewayConsumer } from './rabbit/consumer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log('USER_SERVICE_URL:', process.env.USER_SERVICE_URL);
console.log('COURSE_SERVICE_URL:', process.env.COURSE_SERVICE_URL);

app.use(
  '/api/users',
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
  }),
);

app.use(
  '/api/courses',
  createProxyMiddleware({
    target: process.env.COURSE_SERVICE_URL,
    changeOrigin: true,
  }),
);

async function start() {
  await initRabbit();
  await startGatewayConsumer();

  app.listen(PORT, () => {
    console.log(`API Gateway running on http://localhost:${PORT}`);
  });
}

start();
