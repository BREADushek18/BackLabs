import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import sharp from "sharp";
import { Request, Response, NextFunction } from "express";

const storage = multer.diskStorage({
  destination: "uploads/courses/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Разрешены только изображения"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const processImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) return next();

  try {
    const filePath = req.file.path;
    await sharp(filePath).resize(800).jpeg({ quality: 80 }).toFile(filePath);
    next();
  } catch (error) {
    console.error("Ошибка обработки изображения:", error);
    res.status(500).json({ error: "Ошибка обработки изображения" });
  }
};
