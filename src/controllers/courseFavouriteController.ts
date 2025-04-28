import { Request, Response } from "express";
import { CourseFavouriteModel } from "../models/courseFavourite";
import { CourseModel } from "../models/course";

interface AuthRequest extends Request {
  userId?: string;
}

export const addCourseToFavourites = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Требуется авторизация" });
      return;
    }

    const { id: courseId } = req.params;

    const course = await CourseModel.findById(courseId);
    if (!course) {
      res.status(404).json({ message: "Курс не найден" });
      return;
    }

    const exists = await CourseFavouriteModel.findOne({
      userId: req.userId,
      courseId,
    });

    if (exists) {
      res.status(400).json({ message: "Курс уже в избранном" });
      return;
    }

    const favourite = await CourseFavouriteModel.create({
      userId: req.userId,
      courseId,
    });

    course.favoritesCount = (course.favoritesCount || 0) + 1;
    await course.save();

    res.status(201).json({ message: "Курс добавлен в избранное", favourite });
  } catch (error) {
    console.error("Ошибка добавления курса в избранное:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const removeCourseFromFavourites = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Требуется авторизация" });
      return;
    }

    const { id: courseId } = req.params;

    const deleted = await CourseFavouriteModel.findOneAndDelete({
      userId: req.userId,
      courseId,
    });

    if (!deleted) {
      res.status(404).json({ message: "Курс не найден в избранном" });
      return;
    }

    const course = await CourseModel.findById(courseId);
    if (course && course.favoritesCount && course.favoritesCount > 0) {
      course.favoritesCount -= 1;
      await course.save();
    }

    res.status(200).json({ message: "Курс удален из избранного" });
  } catch (error) {
    console.error("Ошибка удаления курса из избранного:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const getTopFavourites = async (req: Request, res: Response) => {
  try {
    const topCourses = await CourseModel.find()
      .sort({ favoritesCount: -1 })
      .limit(10);

    res.status(200).json({ topCourses });
  } catch (error) {
    console.error("Ошибка получения топа курсов:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const getMyFavourites = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Требуется авторизация" });
      return;
    }

    const myFavourites = await CourseFavouriteModel.find({
      userId: req.userId,
    }).populate("courseId");

    res.status(200).json({ myFavourites });
  } catch (error) {
    console.error("Ошибка получения избранных курсов:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
