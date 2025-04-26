import { Request, Response, NextFunction } from "express";
import { CourseModel } from "../models/course";
import fs from "fs/promises";
import path from "path";

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, description, price, category, level } = req.body;

    if (!title || !description || !price || !category || !level || !req.file) {
      res.status(400).json({ error: "Недостаточно данных" });
      return;
    }

    if (req.role !== "teacher") {
      res
        .status(403)
        .json({ error: "Только преподаватели могут создавать курсы" });
      return;
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice)) {
      res.status(400).json({ error: "Цена должна быть числом" });
      return;
    }

    const newCourse = new CourseModel({
      title,
      description,
      price: numericPrice,
      category,
      level,
      image: req.file.filename,
      author: req.userId, // <<< добавил!
    });

    await newCourse.save();

    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Ошибка создания курса:", error);
    res.status(500).json({ error: "Ошибка сервера" });
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
    if (!course) res.status(404).json({ error: "Курс не найден" });
    res.status(200).json(course);
    return;
  } catch {
    res.status(400).json({ error: "Ошибка получения курса" });
    return;
  }
  return;
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    if (req.role !== "teacher") {
      res
        .status(403)
        .json({ error: "Только преподаватели могут обновлять курсы" });
      return;
    }

    const course = await CourseModel.findById(req.params.id);
    if (!course) {
      res.status(404).json({ error: "Курс не найден" });
      return;
    }

    if (course.author.toString() !== req.userId) {
      res.status(403).json({ error: "Вы можете обновлять только свои курсы" });
      return;
    }

    const updatedCourse = await CourseModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Ошибка обновления курса:", error);
    res.status(400).json({ error: "Ошибка обновления курса" });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    if (req.role !== "teacher") {
      res
        .status(403)
        .json({ error: "Только преподаватели могут удалять курсы" });
      return;
    }

    const course = await CourseModel.findById(req.params.id);
    if (!course) {
      res.status(404).json({ error: "Курс не найден" });
      return;
    }

    if (course.author.toString() !== req.userId) {
      res.status(403).json({ error: "Вы можете удалять только свои курсы" });
      return;
    }

    if (course.image) {
      const imagePath = path.join("uploads", "courses", course.image);
      await fs.unlink(imagePath).catch(() => null);
    }

    res.status(204).send();
  } catch (error) {
    console.error("Ошибка удаления курса:", error);
    res.status(400).json({ error: "Ошибка удаления курса" });
  }
};
