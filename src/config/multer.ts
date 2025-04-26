import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import { Request, Response, NextFunction } from "express";
import fs from "fs/promises";

const uploadDir = "uploads/courses";

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

export const upload = multer({ storage, fileFilter });

export const processImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return next();
  }

  try {
    await fs.mkdir(uploadDir, { recursive: true });
    const ext = path.extname(req.file.originalname) || ".jpeg";
    const newFilename = `compressed-${uuidv4()}${ext}`;
    const outputPath = path.join(uploadDir, newFilename);

    await sharp(req.file.buffer)
      .resize({
        width: 800,
        withoutEnlargement: true,
        fit: "inside",
      })
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    req.file.filename = newFilename;
    req.file.path = outputPath;

    next();
  } catch (error) {
    console.error("Ошибка обработки изображения:", error);
    next(error);
  }
};
