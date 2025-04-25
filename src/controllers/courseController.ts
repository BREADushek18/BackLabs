import { Request, Response, NextFunction } from "express";
import { CourseModel } from "../models/course";
import { TeacherModel } from "../models/teacher";
import fs from "fs/promises";

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, description, price, category, level } = req.body;

    if (!req.userId || !req.file?.path) {
      return res.status(400).json({ error: "Недостаточно данных" });
    }

    const teacher = await TeacherModel.findById(req.userId);
    if (!teacher) {
      await fs.unlink(req.file.path);
      return res
        .status(403)
        .json({ error: "Только преподаватели могут создавать курсы" });
    }

    const course = new CourseModel({
      title,
      description,
      price: Number(price),
      image: req.file.path,
      category,
      level: level || "beginner",
      author: req.userId,
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    if (req.file?.path) await fs.unlink(req.file.path);
    res.status(400).json({ error: "Ошибка создания курса" });
  }
};

export const getAllCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = "1",
      limit = "10",
      search = "",
      category,
      level,
    } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    const query: any = {};
    if (search) query.title = { $regex: search, $options: "i" };
    if (category) query.category = category;
    if (level) query.level = level;

    const courses = await CourseModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const total = await CourseModel.countDocuments(query);

    res.status(200).json({
      data: courses,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const course = await CourseModel.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Курс не найден" });
    res.status(200).json(course);
  } catch {
    res.status(400).json({ error: "Ошибка получения курса" });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const course = await CourseModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!course) return res.status(404).json({ error: "Курс не найден" });
    res.status(200).json(course);
  } catch {
    res.status(400).json({ error: "Ошибка обновления курса" });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const course = await CourseModel.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: "Курс не найден" });
    if (course.image) await fs.unlink(course.image).catch(() => null);
    res.status(204).send();
  } catch {
    res.status(400).json({ error: "Ошибка удаления курса" });
  }
};
