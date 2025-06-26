import { getChannel, EXCHANGE_NAME } from '../utils/rabbitmq';
import { ConsumeMessage } from 'amqplib';
import { logUserRegisteredEvent } from '../logger/logUserEvent';

export async function startGatewayConsumer() {
  const channel = await getChannel();
  const queueName = 'gateway_service_queue';

  await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(queueName, EXCHANGE_NAME, 'user.registered');

  channel.consume(queueName, async (msg: ConsumeMessage | null) => {
    if (!msg) return;

    try {
      const content = msg.content.toString();
      const data = JSON.parse(content);

      console.log('Gateway received user.registered event:', data);

      logUserRegisteredEvent(data);

      channel.ack(msg);
    } catch (e) {
      console.error('Error in gateway consumer:', e);
      channel.nack(msg, false, false);
    }
  });

  console.log('Gateway is listening for user.registered events...');
}
