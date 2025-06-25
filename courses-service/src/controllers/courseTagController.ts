import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { CourseModel } from '../models/course';
import { TagModel } from '../models/tag';

export const addTagToCourse = async (req: Request, res: Response) => {
  try {
    if (req.role !== 'teacher') {
      res
        .status(403)
        .json({ error: 'Только преподаватели могут добавлять теги' });
      return;
    }

    const course = await CourseModel.findById(req.params.id);
    if (!course) {
      res.status(404).json({ error: 'Курс не найден' });
      return;
    }

    const tag = await TagModel.findById(req.params.tagId);
    if (!tag) {
      res.status(404).json({ error: 'Тег не найден' });
      return;
    }

    const tagId = new mongoose.Types.ObjectId(tag._id);
    if (!course.tags.some((t) => t.equals(tagId))) {
      course.tags.push(tagId);
      await course.save();
    }

    const updatedCourse = await CourseModel.findById(course._id).populate(
      'tags',
    );

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error('Ошибка добавления тега:', error);
    res.status(400).json({ error: 'Ошибка добавления тега' });
  }
};

export const removeTagFromCourse = async (req: Request, res: Response) => {
  try {
    if (req.role !== 'teacher') {
      res
        .status(403)
        .json({ error: 'Только преподаватели могут удалять теги' });
      return;
    }

    const course = await CourseModel.findById(req.params.id);
    if (!course) {
      res.status(404).json({ error: 'Курс не найден' });
      return;
    }

    const tagIdToRemove = new mongoose.Types.ObjectId(req.params.tagId);

    course.tags = course.tags.filter((tagId) => !tagId.equals(tagIdToRemove));
    await course.save();

    const deletetagCourse = await CourseModel.findById(course._id).populate(
      'tags',
    );

    res.status(200).json(deletetagCourse);
  } catch (error) {
    console.error('Ошибка удаления тега:', error);
    res.status(400).json({ error: 'Ошибка удаления тега' });
  }
};
