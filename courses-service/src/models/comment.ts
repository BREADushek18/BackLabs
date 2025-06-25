import mongoose, { Document, Schema } from 'mongoose';
import { IComment } from '../types/types';

const commentSchema = new Schema<IComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'userModel',
    },
    userModel: {
      type: String,
      required: true,
      enum: ['Student', 'Teacher'],
    },
    lesson: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    text: { type: String, required: true, maxlength: 255 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const CommentModel = mongoose.model<IComment>('Comment', commentSchema);
