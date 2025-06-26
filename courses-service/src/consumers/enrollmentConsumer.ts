import { getChannel } from '../utils/rabbitmq';
import EnrollmentStatusModel from '../models/enrollmentStatus';
import { EnrollmentModel } from '../models/enrollment';
import { ConsumeMessage } from 'amqplib';

export async function startEnrollmentConsumer() {
  const channel = await getChannel();

  await channel.assertQueue('enroll_queue', { durable: true });

  channel.consume('enroll_queue', async (msg: ConsumeMessage | null) => {
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

  console.log('Enrollment consumer listening on enroll_queue');
}
