import { Request } from 'express';

export function validateLessonInput(req: Request): string | null {
  const { title, videoUrl, course } = req.body;

  if (!title || !videoUrl || !course) {
    return 'Поля: заголовок, ссылка на видео и привязка к курсу - обязательны';
  }

  return null;
}
