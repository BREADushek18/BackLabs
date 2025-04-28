import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

const storageDirectory = 'uploads/watermarked';
const watermarkPath = 'uploads/watermark.png';
const compressionLevel = 80;

export const compressAndWatermarkImage = async (
  buffer: Buffer,
  filename: string,
) => {
  const outputPath = path.join(storageDirectory, filename);

  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error('Невозможно прочитать метаданные изображения');
    }

    const resizedWidth = Math.round(metadata.width * 0.2);
    const resizedHeight = Math.round(metadata.height * 0.2);

    const resizedImage = image.resize(resizedWidth, resizedHeight);

    const watermarkBuffer = await fs.readFile(watermarkPath);
    const watermarkResized = await sharp(watermarkBuffer)
      .resize(Math.round(resizedWidth * 0.4))
      .png()
      .toBuffer();

    await resizedImage
      .composite([
        {
          input: watermarkResized,
          gravity: 'southeast',
          blend: 'over',
        },
      ])
      .jpeg({ quality: compressionLevel })
      .toFile(outputPath);

    console.log('Сохранено обработанное изображение:', outputPath);
    return filename;
  } catch (error) {
    console.error('Ошибка обработки изображения:', error);
    throw error;
  }
};
