import fs from 'fs/promises';
import path from 'path';

export const deleteCourseImages = async (imageFilename: string) => {
  const paths = [
    path.join('uploads', 'courses', imageFilename),
    path.join('uploads', 'watermarked', imageFilename),
  ];

  for (const filePath of paths) {
    try {
      await fs.unlink(filePath);
      console.log('Удалено изображение:', filePath);
    } catch (err) {
      console.error('Ошибка удаления изображения:', err);
    }
  }
};
