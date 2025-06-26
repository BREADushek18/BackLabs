import amqp from 'amqplib';

let connection: amqp.Connection | null = null;

export const initRabbit = async (): Promise<amqp.Connection> => {
  const RABBITMQ_URL = process.env.RABBITMQ_URL;
  if (!RABBITMQ_URL) {
    throw new Error('RABBITMQ_URL is not defined in environment variables');
  }

  let attempts = 0;
  const maxAttempts = 20;

  while (attempts < maxAttempts) {
    try {
      connection = await amqp.connect(RABBITMQ_URL);
      console.log('RabbitMQ connected!');
      return connection;
    } catch (error) {
      attempts++;
      console.error(`RabbitMQ connection failed (attempt ${attempts}):`, error);
      if (attempts < maxAttempts) {
        console.log('Retrying in 5 seconds...');
        await new Promise((res) => setTimeout(res, 5000));
      } else {
        console.error('Max retries reached. Exiting.');
        process.exit(1);
      }
    }
  }
  throw new Error('Failed to connect to RabbitMQ');
};

export const getRabbitConnection = (): amqp.Connection => {
  if (!connection) {
    throw new Error('RabbitMQ connection not established yet.');
  }
  return connection;
};

export const getChannel = async (): Promise<amqp.Channel> => {
  const conn = getRabbitConnection();
  const channel = await conn.createChannel();
  return channel;
};
