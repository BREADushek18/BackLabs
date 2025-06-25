import { Request, Response } from 'express';
import { CommentModel } from '../models/comment';
import Lesson from '../models/lesson';
import { validateCommentInput } from '../utils/validateCommentInput';
import { buildCommentFilters } from '../utils/commentUtils';

export const createComment = async (req: Request, res: Response) => {
  try {
    const error = validateCommentInput(req);
    if (error) {
      res.status(400).json({ message: error });
      return;
    }

    const { lesson, text } = req.body;

    const existingLesson = await Lesson.findById(lesson);
    if (!existingLesson) {
      res.status(404).json({ message: 'Урок не найден' });
      return;
    }

    if (!req.userId || !req.role) {
      res.status(401).json({ message: 'Не авторизован' });
      return;
    }

    const comment = await CommentModel.create({
      user: req.userId,
      userModel: req.role === 'teacher' ? 'Teacher' : 'Student',
      lesson,
      text,
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при создании комментария', err });
  }
};

export const getCommentsByLesson = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
    const { filter, sort, pagination } = buildCommentFilters(
      req.query,
      lessonId,
    );

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      res.status(404).json({ message: 'Урок не найден' });
      return;
    }

    const total = await CommentModel.countDocuments(filter);
    const comments = await CommentModel.find(filter)
      .populate({ path: 'user', select: 'firstName lastName' })
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.limit);

    res.json({
      lesson,
      total,
      page: pagination.page,
      limit: pagination.limit,
      comments,
    });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка получения комментариев', err });
  }
};

export const getCommentById = async (req: Request, res: Response) => {
  try {
    const comment = await CommentModel.findById(req.params.id).populate(
      'user',
      'firstName lastName',
    );
    if (!comment) {
      res.status(404).json({ message: 'Комментарий не найден' });
      return;
    }
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка получения комментария', err });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const comment = await CommentModel.findById(req.params.id);
    if (!comment) {
      res.status(404).json({ message: 'Комментарий не найден' });
      return;
    }

    if (comment.user.toString() !== req.userId) {
      res
        .status(403)
        .json({ message: 'Можно редактировать только свои комментарии' });
      return;
    }

    const { text } = req.body;
    if (!text || typeof text !== 'string' || text.length > 255) {
      res.status(400).json({ message: 'Некорректный текст' });
      return;
    }

    comment.text = text;
    await comment.save();

    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка обновления комментария', err });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const comment = await CommentModel.findById(req.params.id);
    if (!comment) {
      res.status(404).json({ message: 'Комментарий не найден' });
      return;
    }

    const isAuthor = comment.user.toString() === req.userId;
    const isTeacher = req.role === 'teacher';

    if (!isAuthor && !isTeacher) {
      res.status(403).json({ message: 'Нет прав на удаление' });
      return;
    }

    await comment.deleteOne();
    res.json({ message: 'Комментарий удален' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка удаления комментария', err });
  }
};
