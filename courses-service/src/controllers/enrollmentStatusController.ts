import { Request, Response } from 'express';
import EnrollmentStatusModel from '../models/enrollmentStatus';

export async function getEnrollmentStatus(req: Request, res: Response) {
  const { enrollmentId } = req.params;

  const statusDoc = await EnrollmentStatusModel.findOne({ enrollmentId });

  if (!statusDoc) {
    res.status(404).json({ message: 'Статус не найден' });
    return;
  }

  res.status(200).json({
    enrollmentId: statusDoc.enrollmentId,
    status: statusDoc.status,
    error: statusDoc.error,
    updatedAt: statusDoc.updatedAt,
  });
}
