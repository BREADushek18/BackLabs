import { Request } from 'express';

export function validateCourseInput(req: Request) {
  const { title, description, price, category, level } = req.body;
  const { file } = req;

  if (!title || !description || !price || !category || !level || !file) {
    return 'Недостаточно данных';
  }

  if (isNaN(Number(price))) {
    return 'Цена должна быть числом';
  }

  return null;
}
