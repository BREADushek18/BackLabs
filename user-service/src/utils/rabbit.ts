import amqp from 'amqplib';

let channel: amqp.Channel;

export async function createPublisher() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL!);
  channel = await conn.createChannel();
  await channel.assertQueue('enrollments_queue', { durable: true });
}

export function publishEnrollment(data: any) {
  channel.sendToQueue('enrollments_queue', Buffer.from(JSON.stringify(data)), {
    persistent: true,
  });
}
