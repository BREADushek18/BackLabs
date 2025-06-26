import { Request, Response } from 'express';
import { EnrollmentModel } from '../models/enrollment';
import { CourseModel } from '../models/course';
import Lesson from '../models/lesson';
import mongoose from 'mongoose';
import { getChannel } from '../utils/rabbitmq';
import { v4 as uuidv4 } from 'uuid';

export async function enroll(req: Request, res: Response) {
  const { userId, courseId } = req.body;
  const enrollmentId = uuidv4();

  const msg = { enrollmentId, userId, courseId, timestamp: Date.now() };

  try {
    const channel = await getChannel();
    await channel.assertQueue('enroll_queue', { durable: true }); // рекомендуемая практика
    channel.sendToQueue('enroll_queue', Buffer.from(JSON.stringify(msg)), {
      persistent: true,
    });
  } catch (error) {
    console.error('Failed to send message to queue', error);
    return res.status(500).json({ error: 'Ошибка отправки в очередь' });
  }

  return res.status(200).json({ enrollmentId, status: 'queued' });
}

export const enrollInCourse = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId;
    const existing = await EnrollmentModel.findOne({
      student: req.userId,
      course: courseId,
    });
    if (existing) {
      res.status(400).json({ error: 'Уже записаны на курс' });
      return;
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
      res.status(404).json({ error: 'Курс не найден' });
      return;
    }

    const enrollment = new EnrollmentModel({
      student: req.userId,
      course: courseId,
      completedLessons: [],
    });

    await enrollment.save();
    res.status(201).json(enrollment);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Ошибка записи на курс' });
    return;
  }
};

export const getMyEnrollments = async (req: Request, res: Response) => {
  try {
    const enrollments = await EnrollmentModel.find({
      student: req.userId,
    }).populate('course');
    res.status(200).json(enrollments);
    return;
  } catch {
    res.status(500).json({ error: 'Ошибка получения записей' });
    return;
  }
};

export const deleteEnrollment = async (req: Request, res: Response) => {
  try {
    const deleted = await EnrollmentModel.findOneAndDelete({
      student: req.userId,
      course: req.params.courseId,
    });
    if (!deleted) {
      res.status(404).json({ error: 'Запись не найдена' });
      return;
    }

    res.status(204).send();
    return;
  } catch {
    res.status(500).json({ error: 'Ошибка удаления записи' });
    return;
  }
};

export const markLessonCompleted = async (req: Request, res: Response) => {
  try {
    const courseId = new mongoose.Types.ObjectId(req.params.courseId);
    const lessonId = new mongoose.Types.ObjectId(req.params.lessonId);
    const studentId = new mongoose.Types.ObjectId(req.userId);

    const enrollment = await EnrollmentModel.findOne({
      student: studentId,
      course: courseId,
    });
    if (!enrollment) {
      res.status(404).json({ error: 'Нет записи на курс' });
      return;
    }

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
      await enrollment.save();
    }

    res.status(200).json({ completedLessons: enrollment.completedLessons });
    return;
  } catch {
    res.status(500).json({ error: 'Ошибка отметки урока' });
    return;
  }
};

export const unmarkLessonCompleted = async (req: Request, res: Response) => {
  const { courseId, lessonId } = req.params;
  try {
    const enrollment = await EnrollmentModel.findOne({
      student: req.userId,
      course: courseId,
    });
    if (!enrollment) {
      res.status(404).json({ error: 'Нет записи на курс' });
      return;
    }

    enrollment.completedLessons = enrollment.completedLessons.filter(
      (id) => id.toString() !== lessonId,
    );
    await enrollment.save();

    res.status(200).json({ completedLessons: enrollment.completedLessons });
    return;
  } catch {
    res.status(500).json({ error: 'Ошибка отмены завершения' });
    return;
  }
};

export const getCourseProgress = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  try {
    const enrollment = await EnrollmentModel.findOne({
      student: req.userId,
      course: courseId,
    });
    if (!enrollment) {
      res.status(404).json({ error: 'Нет записи на курс' });
      return;
    }

    const totalLessons = await Lesson.countDocuments({ course: courseId });
    const completed = enrollment.completedLessons.length;

    res.status(200).json({
      courseId,
      progress: `${completed} из ${totalLessons} уроков`,
    });
    return;
  } catch {
    res.status(500).json({ error: 'Ошибка получения прогресса' });
    return;
  }
};

export const countCourseStudents = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId;
    const count = await EnrollmentModel.countDocuments({ course: courseId });
    res.status(200).json({ courseId, enrolledStudents: count });
    return;
  } catch {
    res.status(500).json({ error: 'Ошибка подсчета студентов' });
    return;
  }
};
