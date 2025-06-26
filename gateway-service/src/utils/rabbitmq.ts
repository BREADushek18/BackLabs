import amqp from 'amqplib';

export const EXCHANGE_NAME = 'edu_exchange';

let connection: amqp.Connection | null = null;
let channel: amqp.Channel | null = null;

export const initRabbit = async (): Promise<amqp.Connection> => {
  if (connection) return connection;

  const RABBITMQ_URL = process.env.RABBITMQ_URL;
  if (!RABBITMQ_URL) throw new Error('RABBITMQ_URL is not defined');

  let attempts = 0;
  const maxAttempts = 20;

  while (attempts < maxAttempts) {
    try {
      connection = await amqp.connect(RABBITMQ_URL);
      console.log('RabbitMQ connected!');
      channel = await connection.createChannel();
      await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
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

export const getChannel = async (): Promise<amqp.Channel> => {
  if (!channel) {
    if (!connection) await initRabbit();
    if (!channel) throw new Error('Channel not initialized');
  }
  return channel;
};
