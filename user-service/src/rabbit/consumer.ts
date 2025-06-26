import { getChannel, EXCHANGE_NAME } from '../utils/rabbitmq';
import { ConsumeMessage } from 'amqplib';

export async function startUserConsumer() {
  const channel = await getChannel();
  const queueName = 'user_service_queue';

  await channel.assertQueue(queueName, { durable: true });

  await channel.bindQueue(queueName, EXCHANGE_NAME, 'user.registered');

  channel.consume(queueName, async (msg: ConsumeMessage | null) => {
    if (!msg) return;

    try {
      const content = msg.content.toString();
      const data = JSON.parse(content);

      console.log('User-service received user.registered event:', data);

      channel.ack(msg);
    } catch (e) {
      console.error('Error processing message:', e);
      channel.nack(msg, false, false);
    }
  });

  console.log(
    'User-service consumer started, listening to user.registered events',
  );
}
