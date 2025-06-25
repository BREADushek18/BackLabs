import { Request, Response } from 'express';
import { CourseModel } from '../models/course';
import Lesson from '../models/lesson';
import { buildLessonFilters } from '../utils/lessonUtils';
import { validateLessonInput } from '../utils/validateLessonInput';

export const createLesson = async (req: Request, res: Response) => {
  try {
    if (req.role !== 'teacher') {
      res
        .status(403)
        .json({ message: 'Только преподаватели могут создавать уроки' });
      return;
    }

    const validationError = validateLessonInput(req);
    if (validationError) {
      res.status(400).json({ message: validationError });
      return;
    }

    const { title, content, videoUrl, course, order } = req.body;

    const existingCourse = await CourseModel.findById(course);
    if (!existingCourse) {
      res.status(404).json({ message: 'Курс не найден' });
      return;
    }

    const lesson = await Lesson.create({
      title,
      content,
      videoUrl,
      course,
      order,
      author: req.userId,
    });

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Не удалось создать урок', error });
  }
};

export const getLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findById(id).populate('course');
    if (!lesson) {
      res.status(404).json({ message: 'Урок не найден' });
      return;
    }

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Не удалось получить урок', error });
  }
};

export const getAllLessons = async (req: Request, res: Response) => {
  try {
    const { filter, sort, pagination } = buildLessonFilters(req.query);

    const total = await Lesson.countDocuments(filter);
    const lessons = await Lesson.find(filter)
      .populate('course')
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.limit);

    res.json({
      total,
      page: pagination.page,
      limit: pagination.limit,
      data: lessons,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Не удалось получить список уроков', error });
  }
};

export const updateLesson = async (req: Request, res: Response) => {
  try {
    if (req.role !== 'teacher') {
      res
        .status(403)
        .json({ message: 'Только преподаватели могут обновлять уроки' });
      return;
    }

    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      res.status(404).json({ message: 'Урок не найден' });
      return;
    }

    if (lesson.author.toString() !== req.userId) {
      res
        .status(403)
        .json({ message: 'Вы можете обновлять только свои уроки' });
      return;
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    res.json(updatedLesson);
  } catch (error) {
    res.status(500).json({ message: 'Не удалось обновить урок', error });
  }
};

export const deleteLesson = async (req: Request, res: Response) => {
  try {
    if (req.role !== 'teacher') {
      res
        .status(403)
        .json({ message: 'Только преподаватели могут удалять уроки' });
      return;
    }

    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      res.status(404).json({ message: 'Урок не найден' });
      return;
    }

    if (lesson.author.toString() !== req.userId) {
      res.status(403).json({ message: 'Вы можете удалять только свои уроки' });
      return;
    }

    await lesson.deleteOne();

    res.json({ message: 'Урок успешно удалён' });
  } catch (error) {
    res.status(500).json({ message: 'Не удалось удалить урок', error });
  }
};
