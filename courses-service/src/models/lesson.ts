import mongoose, { Document, Schema } from 'mongoose';
import { ILesson } from '../types/types';

const lessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    videoUrl: { type: String },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    order: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export default mongoose.model<ILesson>('Lesson', lessonSchema);
