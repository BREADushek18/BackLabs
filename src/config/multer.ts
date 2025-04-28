import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { compressAndWatermarkImage } from './sharp';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Пожалуйста, загрузите изображение'));
    }
    cb(null, true);
  },
});

export const processImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      return next();
    }

    const filename = uuidv4() + '.jpg';

    const uploadDir = path.join('uploads', 'watermarked');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.error('Ошибка создания папки загрузки:', err);
    }

    await compressAndWatermarkImage(req.file.buffer, filename);

    req.file.filename = filename;
    req.body.image = filename;

    next();
  } catch (error) {
    console.error('Ошибка при обработке изображения:', error);
    res.status(500).json({ message: 'Ошибка при обработке изображения' });
  }
};
