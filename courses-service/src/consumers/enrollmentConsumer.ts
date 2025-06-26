import { getChannel, EXCHANGE_NAME } from '../utils/rabbitmq';
import EnrollmentStatusModel from '../models/enrollmentStatus';
import { EnrollmentModel } from '../models/enrollment';
import { ConsumeMessage } from 'amqplib';

const QUEUE_NAME = 'enroll_queue';
const ROUTING_KEY = 'enroll';

export async function startEnrollmentConsumer() {
  const channel = await getChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });
  await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, ROUTING_KEY);

  channel.consume(QUEUE_NAME, async (msg: ConsumeMessage | null) => {
    if (!msg) return;

    let parsed;
    try {
      parsed = JSON.parse(msg.content.toString());
    } catch (e) {
      console.error('Invalid message format', msg.content.toString());
      channel.ack(msg);
      return;
    }

    const { enrollmentId, userId, courseId } = parsed;

    await EnrollmentStatusModel.updateOne(
      { enrollmentId },
      { status: 'processing', updatedAt: new Date() },
      { upsert: true },
    );

    try {
      await EnrollmentModel.create({
        student: userId,
        course: courseId,
        completedLessons: [],
      });

      await EnrollmentStatusModel.updateOne(
        { enrollmentId },
        { status: 'done', updatedAt: new Date() },
      );

      console.log(
        `Enrollment created for user ${userId} in course ${courseId}`,
      );
      channel.ack(msg);
    } catch (err: any) {
      console.error('Enrollment creation failed:', err.message);
      await EnrollmentStatusModel.updateOne(
        { enrollmentId },
        {
          status: 'error',
          error: err.message,
          updatedAt: new Date(),
        },
      );
      channel.ack(msg);
    }
  });

  console.log(`Enrollment consumer listening on queue ${QUEUE_NAME}`);
}
