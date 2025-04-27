import { Request, Response, NextFunction } from "express";
import { TagModel } from "../models/tag";
import slugify from "slugify";

export const getTags = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tags = await TagModel.find();
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
};

export const createTag = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: "Название тега обязательно" });
      return;
    }

    const existingTag = await TagModel.findOne({ name });
    if (existingTag) {
      res.status(400).json({ error: "Такой тег уже существует" });
      return;
    }

    const newTag = new TagModel({
      name,
      slug: slugify(name, { lower: true }),
    });
    await newTag.save();

    res.status(201).json(newTag);
  } catch (error) {
    console.error("Ошибка создания тега:", error);
    res.status(500).json({ error: "Ошибка сервера при создании тега" });
  }
};

export const deleteTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tag = await TagModel.findByIdAndDelete(req.params.id);
    if (!tag) {
      res.status(404).json({ error: "Тег не найден" });
      return;
    }
    res.status(200).json({ message: "Тег успешно удален" });
  } catch (error) {
    next(error);
  }
  return;
};
