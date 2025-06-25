import mongoose, { Schema, Document } from 'mongoose';
import { IEnrollment } from '../types/types';

const enrollmentSchema = new Schema<IEnrollment>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    completedLessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const EnrollmentModel = mongoose.model<IEnrollment>(
  'Enrollment',
  enrollmentSchema,
);
