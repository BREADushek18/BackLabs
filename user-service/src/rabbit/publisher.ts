import { getChannel, EXCHANGE_NAME } from '../utils/rabbitmq';

export async function publishUserRegistered(userData: any) {
  const channel = await getChannel();
  const routingKey = 'user.registered';
  const msg = Buffer.from(JSON.stringify(userData));
  channel.publish(EXCHANGE_NAME, routingKey, msg, { persistent: true });
}
