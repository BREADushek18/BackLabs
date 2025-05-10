import { Request } from 'express';

export function validateCommentInput(req: Request): string | null {
  const { lesson, text } = req.body;

  if (!lesson || !text) {
    return 'Поле lesson и текст обязательны';
  }

  if (typeof text !== 'string' || text.length > 255) {
    return 'Текст должен быть строкой длиной до 255 символов';
  }

  return null;
}
