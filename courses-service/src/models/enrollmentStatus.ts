import mongoose, { Schema, Document } from 'mongoose';
import { IEnrollmentStatus } from '../types/types';

const enrollmentStatusSchema = new Schema<IEnrollmentStatus>(
  {
    enrollmentId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['queued', 'processing', 'done', 'error'],
      default: 'queued',
    },
    error: { type: String, default: null },
    updatedAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

const EnrollmentStatusModel = mongoose.model<IEnrollmentStatus>(
  'EnrollmentStatus',
  enrollmentStatusSchema,
);

export default EnrollmentStatusModel;
